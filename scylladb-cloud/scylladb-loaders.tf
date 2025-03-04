# Create three EC2 instances based on the specified AMI, instance type, subnet ID, and security groups. 
# Create tags to identify the instances and sets timeouts for creating the instances.

resource "aws_instance" "instance" {
  count           = var.loader_node_count
  ami             = data.aws_ami.loader_ami.id
  instance_type   = var.instance_type
  subnet_id       = element(aws_subnet.public_subnet.*.id, count.index)
  security_groups = [aws_security_group.sg.id, ]
  key_name        = aws_key_pair.generated_key.key_name
  tags = {
    "Name"      = "${var.custom_name}-Loader-${count.index}"
    "CreatedBy" = "scylladb-demo"
  }

  timeouts {
    create = "10m"
  }

  # Provision files to each instance. Copy loader files.

  provisioner "file" {
    source      = "../loader/Dockerfile"
    destination = "/home/scyllaadm/Dockerfile"
  }
  provisioner "file" {
    source      = "../loader/loader.sh"
    destination = "/home/scyllaadm/loader.sh"
  }
  provisioner "file" {
    source      = "../loader/docker.sh"
    destination = "/home/scyllaadm/docker.sh"
  }

  provisioner "file" {
    source      = "../loader/cql-stress.service"
    destination = "/home/scyllaadm/cql-stress.service"
  }

  # Build loader app 
  provisioner "remote-exec" {
    inline = [
      "sudo systemctl stop scylla-server |tee scylla.log",
      "sudo chmod +x /home/scyllaadm/docker.sh",
      "sudo /home/scyllaadm/docker.sh",
      "sudo systemctl restart docker",
      "cd /home/scyllaadm/ && sudo docker build -t loader .",
      "echo 'sudo docker run loader ${var.loader_ops_per_sec} ${var.loader_read_ratio} ${var.loader_write_ratio} \"${local.scylla_ips}\" \"${var.scylla_user}\" \"${local.scylla_pass}\"' > start.sh",
      "sudo chmod +x start.sh",
      "sudo mv /home/scyllaadm/cql-stress.service /etc/systemd/system/cql-stress.service ",
      "sudo systemctl daemon-reload ",
      "sudo systemctl start cql-stress.service",
    ]
  }

  # Set up an SSH connection to each EC2 instance using the scyllaadm user and the private key. 
  # The coalesce function is used to select the public IP address of ScyllaDB Nodes.
  connection {
    type        = "ssh"
    user        = "scyllaadm"
    private_key = tls_private_key.private_key.private_key_pem
    host        = coalesce(self.public_ip, self.private_ip)
    agent       = false
  }

}


# Create three Elastic IPs
resource "aws_eip" "eip" {
  count            = length(aws_instance.instance.*.id)               # Create an Elastic IP for each EC2 instance
  instance         = element(aws_instance.instance.*.id, count.index) # Associate the Elastic IP with the current EC2 instance
  public_ipv4_pool = "amazon"                                         # Use the Amazon pool for public IPv4 addresses
  domain           = "vpc"                                            # Create a VPC Elastic IP address

  tags = { # Add tags to the Elastic IP resource
    "Name" = "${var.custom_name}-EIP-${count.index}"
  }
}

# Create EIP association with EC2 Instances
resource "aws_eip_association" "eip_association" {
  count         = length(aws_eip.eip)                              # Associate each Elastic IP with an EC2 instance
  instance_id   = element(aws_instance.instance.*.id, count.index) # Associate the current Elastic IP with the current EC2 instance
  allocation_id = element(aws_eip.eip.*.id, count.index)           # Associate the current Elastic IP with the current allocation ID
}

