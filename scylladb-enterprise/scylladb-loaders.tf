# Create three EC2 instances based on the specified AMI, instance type, subnet ID, and security groups. 
# Create tags to identify the instances and sets timeouts for creating the instances.

resource "aws_instance" "loader_instance" {
  count           = var.loader_node_count
  ami             = var.loader_ami_id
  instance_type   = var.loader_instance_type
  subnet_id       = element(aws_subnet.public_subnet.*.id, count.index)
  security_groups = [aws_security_group.sg.id, ]
  key_name        = var.aws_key_pair_name
  tags = {
    "Name"      = "${var.custom_name}-Loader-${count.index}"
    "CreatedBy" = "scylladb-demo"
  }

  timeouts {
    create = "10m"
  }

  # Provision files to each instance. Copy three files from the current directory 
  # to the remote instance: stress.yml, cassandra-stress.service, and cassandra-stress-benchmark.service.

  provisioner "file" {
    source      = "./stress/stress.yml"
    destination = "/home/scyllaadm/stress.yml"
  }
  provisioner "file" {
    source      = "./stress/cassandra-stress.service"
    destination = "/home/scyllaadm/cassandra-stress.service"
  }
  provisioner "file" {
    source      = "./stress/cassandra-stress-benchmark.service"
    destination = "/home/scyllaadm/cassandra-stress-benchmark.service"
  }

  # Run remote-exec commands on each instance. It stops the scylla-server, creates a start.sh script, 
  # creates a benchmark.sh script, sets permissions on the scripts, moves two files to /etc/systemd/system/, 
  # runs daemon-reload, and starts the cassandra-stress service.

  provisioner "remote-exec" {
    inline = [
      "sudo systemctl stop scylla-server |tee scylla.log",
      "echo '/usr/bin/cassandra-stress user profile=./stress.yml n=${var.num_of_ops} cl=local_quorum no-warmup \"ops(insert=1)\" -rate threads=${var.num_threads} fixed=120000/s -mode native cql3 user=scylla password=pass -log file=populating.log -pop seq=1..100M -node ${local.scylla_ips}' > start.sh",
      "echo '/usr/bin/cassandra-stress user profile=./stress.yml duration=24h no-warmup cl=local_quorum \"ops(add_sensor_data=1,get_sensor_data=3)\" -rate threads=${var.num_threads} fixed=${var.throttle} -mode native cql3 user=scylla password=pass -log file=benchmarking.log -node ${local.scylla_ips}' > benchmark.sh",
      "sudo chmod +x start.sh benchmark.sh",
      "echo '/home/scyllaadm/benchmark.sh' >> /home/scyllaadm/start.sh",
      "sudo mv /home/scyllaadm/cassandra-stress.service /etc/systemd/system/cassandra-stress.service ",
      "sudo mv /home/scyllaadm/cassandra-stress-benchmark.service /etc/systemd/system/cassandra-stress-benchmark.service ",
      "sudo systemctl daemon-reload ",
      "sudo systemctl start cassandra-stress.service",
    ]
  }

  # Set up an SSH connection to each EC2 instance using the scyllaadm user and the private key. 
  # The coalesce function is used to select the public IP address of ScyllaDB Nodes.
  connection {
    type        = "ssh"
    user        = var.instance_username
    private_key = file(var.ssh_private_key)
    host        = coalesce(self.public_ip, self.private_ip)
    agent       = true
  }

}


# Create Elastic IP
resource "aws_eip" "eip" {
  count            = length(aws_instance.loader_instance.*.id)               # Create an Elastic IP for each EC2 instance
  instance         = element(aws_instance.loader_instance.*.id, count.index) # Associate the Elastic IP with the current EC2 instance
  public_ipv4_pool = "amazon"                                                # Use the Amazon pool for public IPv4 addresses
  domain           = "vpc"                                                   # Create a VPC Elastic IP address

  tags = { # Add tags to the Elastic IP resource
    "Name" = "${var.custom_name}-EIP-${count.index}"
  }
}

# Create EIP association with EC2 Instances
resource "aws_eip_association" "eip_association" {
  count         = length(aws_eip.eip)                                     # Associate each Elastic IP with an EC2 instance
  instance_id   = element(aws_instance.loader_instance.*.id, count.index) # Associate the current Elastic IP with the current EC2 instance
  allocation_id = element(aws_eip.eip.*.id, count.index)                  # Associate the current Elastic IP with the current allocation ID
}

