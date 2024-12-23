resource "aws_instance" "scylladb-monitoring" {
  ami           = var.monitoring_ami_id
  instance_type = var.monitoring_instance_type
  key_name      = var.aws_key_pair_name

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
    scripts = [
      "monitoring/setup_docker.sh",
      "monitoring/clone_monitoring_repo.sh"
    ]

    connection {
      type        = "ssh"
      user        = var.instance_username_monitoring
      private_key = file(var.ssh_private_key)
      host        = self.public_ip
    }
  }

  provisioner "file" {
    content = templatefile("monitoring/configure_monitoring.sh.tpl", {
      CLUSTER_NAME   = var.custom_name,
      scylla_servers = join("\n", formatlist("  - %s:9180", concat(aws_instance.scylladb_seed.*.private_ip, aws_instance.scylladb_nonseeds.*.private_ip))),
      DC_NAME        = var.aws_region
    })
    destination = "/tmp/configure_monitoring.sh"

    connection {
      type        = "ssh"
      user        = var.instance_username_monitoring
      private_key = file(var.ssh_private_key)
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
      private_key = file(var.ssh_private_key)
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
      private_key = file(var.ssh_private_key)
      host        = self.public_ip
    }
  }

  connection {
    type        = "ssh"
    user        = var.instance_username_monitoring
    private_key = file(var.ssh_private_key)
    host        = self.public_ip
  }
}

locals {
  template_file_init = templatefile("${path.module}/grafana-urls.tftpl", {
    monitoring_ip = "${aws_instance.scylladb-monitoring.*.public_ip[0]}"
  })
}

resource "local_file" "grafana_urls" {
  content  = local.template_file_init
  filename = "${path.module}/data/grafana_urls.json"
}

output "monitoring_url" {
  value = format("http://%s:3000", aws_instance.scylladb-monitoring.*.public_ip[0])
}
