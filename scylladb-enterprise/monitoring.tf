resource "aws_instance" "scylladb-monitoring" {
  ami           = data.aws_ami.monitoring_ami.id
  instance_type = var.monitoring_instance_type
  key_name      = aws_key_pair.generated_key.key_name

  security_groups = [aws_security_group.sg.id]
  subnet_id       = element(aws_subnet.public_subnet.*.id, 0)
  tags = {
    Name      = "${var.custom_name}-Monitoring"
    "Project" = "${var.custom_name}"
    "Type"    = "Monitoring"
  }
  depends_on = [aws_instance.scylladb_seed]


  # Provisioner to install and run Scylla Monitoring
  provisioner "remote-exec" {
    script = "monitoring/monitoring.sh"

    connection {
      type        = "ssh"
      user        = var.instance_username_monitoring
      private_key = tls_private_key.private_key.private_key_pem
      host        = self.public_ip
    }
  }

  provisioner "file" {
    content = templatefile("monitoring/configure_monitoring.sh.tpl", {
      CLUSTER_NAME   = var.custom_name,
      scylla_servers = join("\n", formatlist("  - %s:9180", concat(aws_instance.scylladb_seed.*.private_ip, aws_instance.scylladb_nonseeds.*.private_ip))),
      DC_NAME        = var.region
    })
    destination = "/tmp/configure_monitoring.sh"

    connection {
      type        = "ssh"
      user        = var.instance_username_monitoring
      private_key = tls_private_key.private_key.private_key_pem
      host        = self.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod +x /tmp/configure_monitoring.sh",
      "sudo /tmp/configure_monitoring.sh"
    ]

    connection {
      type        = "ssh"
      user        = var.instance_username_monitoring
      private_key = tls_private_key.private_key.private_key_pem
      host        = self.public_ip
    }
  }

  provisioner "remote-exec" {
    inline = [
      "cd scylla-monitoring",
      "export docker=/usr/bin/docker",
      "chmod +x ./start-all.sh",
      "chmod +x ./versions.sh",
      "bash ./start-all.sh -d prometheus_data --no-loki --no-renderer --no-alertmanager --no-cas --no-cdc -c GF_SECURITY_ALLOW_EMBEDDING=true",
      "echo 'done'",
    ]

    connection {
      type        = "ssh"
      user        = var.instance_username_monitoring
      private_key = tls_private_key.private_key.private_key_pem
      host        = self.public_ip
    }
  }

  connection {
    type        = "ssh"
    user        = var.instance_username_monitoring
    private_key = tls_private_key.private_key.private_key_pem
    host        = self.public_ip
  }
}

locals {
  scylla_grafana_url = format("http://%s:3000", aws_instance.scylladb-monitoring.*.public_ip[0])

  template_file_init = templatefile("${path.module}/../terraform-data.tftpl", {
    monitoring_url  = local.scylla_grafana_url
    scylla_version  = "6-2"
    is_scylla_cloud = "false"
    scenario_steps  = "\"original_cluster\", \"sample_data\", \"start_stress\", \"scale_out\", \"stop_stress\", \"scale_in\""
    demo            = "scylladb-enterprise"
  })
}

resource "local_file" "grafana_urls" {
  content  = local.template_file_init
  filename = "${path.module}/../frontend/public/data/terraform-data.json"
}

output "monitoring_url" {
  value = local.scylla_grafana_url
}
