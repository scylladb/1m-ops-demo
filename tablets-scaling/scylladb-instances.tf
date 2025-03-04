

# Create ssh keys on the fly
resource "tls_private_key" "private_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = "ScyllaDB-Enterprise-DEMO-key"
  public_key = tls_private_key.private_key.public_key_openssh
}

resource "aws_instance" "scylladb_seed" {
  count         = 1
  ami           = data.aws_ami.scylla_ami.id
  instance_type = var.scylla_node_type
  key_name      = aws_key_pair.generated_key.key_name

  subnet_id       = element(aws_subnet.public_subnet.*.id, count.index)
  security_groups = [aws_security_group.sg.id]

  tags = {
    Name      = "${var.custom_name}-ScyllaDBInstance-Seed-${count.index}"
    "Project" = "${var.custom_name}"
    "Type"    = "Scylla"
    "Group"   = "Seed"
  }

  user_data = <<EOF
{
    "scylla_yaml": {
        "cluster_name": "${var.custom_name}",
        "internode_compression": "all",
        },
    "start_scylla_on_first_boot": true
}
EOF

  provisioner "file" {
    source      = "./stress/schema.cql"
    destination = "/home/ubuntu/schema.cql"
  }

  provisioner "file" {
    source      = "./ansible/restore_snapshot.sh"
    destination = "/home/ubuntu/restore_snapshot.sh"
  }

  # Set up an SSH connection to each EC2 instance using the scyllaadm user and the private key. 
  # The coalesce function is used to select the public IP address of ScyllaDB Nodes.
  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = tls_private_key.private_key.private_key_pem
    host        = coalesce(self.public_ip, self.private_ip)
    agent       = false
  }
}


resource "aws_instance" "scylladb_nonseeds" {
  count         = var.scylla_node_count - 1
  ami           = data.aws_ami.scylla_ami.id
  instance_type = var.scylla_node_type
  key_name      = aws_key_pair.generated_key.key_name

  subnet_id       = element(aws_subnet.public_subnet.*.id, count.index)
  security_groups = [aws_security_group.sg.id]

  tags = {
    Name      = "${var.custom_name}-ScyllaDBInstance-${count.index}"
    "Project" = "${var.custom_name}"
    "Type"    = "Scylla"
    "Group"   = "NonSeed"
  }
  user_data = <<EOF
{
    "scylla_yaml": {
        "cluster_name": "${var.custom_name}",
         "seed_provider": [{"class_name": "org.apache.cassandra.locator.SimpleSeedProvider",
                            "parameters": [{"seeds": "${aws_instance.scylladb_seed[0].private_ip}"}]}],
         "internode_compression": "all",
        },
    "start_scylla_on_first_boot": false
}
EOF

  depends_on = [aws_instance.scylladb_seed]
}

# Generate private key file for Ansible
resource "local_file" "keyfile_ansible_config" {
  content  = <<-DOC
    ${tls_private_key.private_key.private_key_pem}

    DOC
  filename = "./ansible/key.pem"

  provisioner "local-exec" {
    command = "chmod 600 ./ansible/key.pem"
  }

}

# Gerenate Ansible config file
resource "local_file" "file_ansible_config" {
  content  = <<-DOC
    # Ansible config
    # Generated by Terraform configuration

    [defaults]
    home=./
    inventory=inventory.ini
    host_key_checking=False
    interpreter_python=auto_silent
    force_valid_group_names=ignore
    private_key_file=key.pem
    remote_user=scyllaadm

    DOC
  filename = "./ansible/ansible.cfg"
}

# Generate Ansible inventory file
resource "local_file" "file_ansible_inventory" {
  depends_on = [aws_instance.scylladb_seed, aws_instance.scylladb_nonseeds, aws_instance.loader_instance, aws_eip.eip, aws_eip_association.eip_association]
  content    = <<-DOC
    # Ansible inventory containing IP addresses from Terraform
    # Generated by Terraform configuration

    [original_cluster]
    ${join("\n", concat(aws_instance.scylladb_seed.*.public_ip, slice(aws_instance.scylladb_nonseeds.*.public_ip, 0, 2)))}

    [scale_out]
    ${join("\n", slice(aws_instance.scylladb_nonseeds.*.public_ip, 2, (var.scylla_node_count) - 1))}

    [stress]
    ${join("\n", aws_eip.eip.*.public_ip)}

    DOC
  filename   = "./ansible/inventory.ini"
}


output "scylla_ips" {
  value = join(",", [join(",", aws_instance.scylladb_seed.*.private_ip), join(",", aws_instance.scylladb_nonseeds.*.private_ip)])
}

output "scylla_public_ips" {
  value = join(",", [join(",", aws_instance.scylladb_seed.*.public_ip), join(",", aws_instance.scylladb_nonseeds.*.public_ip)])
}