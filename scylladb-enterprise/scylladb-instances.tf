
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
  ami           = var.scylla_ami_id
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
        },
    "start_scylla_on_first_boot": true
}
EOF
}

resource "aws_instance" "scylladb_nonseeds" {
  count         = var.scylla_node_count - 1
  ami           = var.scylla_ami_id
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
        "start_scylla_on_first_boot": true
         "seed_provider": [{"class_name": "org.apache.cassandra.locator.SimpleSeedProvider",
                            "parameters": [{"seeds": "${aws_instance.scylladb_seed[0].private_ip}"}]}]
        },
}
EOF

  depends_on = [aws_instance.scylladb_seed]
}


output "scylla_ips" {
  value = join(",", [join(",", aws_instance.scylladb_seed.*.private_ip), join(",", aws_instance.scylladb_nonseeds.*.private_ip)])
}

output "scylla_public_ips" {
  value = join(",", [join(",", aws_instance.scylladb_seed.*.public_ip), join(",", aws_instance.scylladb_nonseeds.*.public_ip)])
}