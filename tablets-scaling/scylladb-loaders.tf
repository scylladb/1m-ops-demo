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
  # to the remote instance: stress.yml, cql-stress.service.

  provisioner "file" {
    source      = "./stress/cql-stress.service"
    destination = "/home/ubuntu/cql-stress.service"
  }

  # Run remote-exec commands on each instance. It stops the scylla-server, creates a start.sh script, 
  # creates a benchmark.sh script, sets permissions on the scripts, moves two files to /etc/systemd/system/, 
  # runs daemon-reload, and starts the cql-stress service.

  provisioner "remote-exec" {
    inline = [
      # "sudo systemctl stop scylla-server |tee scylla.log",
      "sudo apt-get update -y",
      "sudo DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential libssl-dev git-all pkg-config",
      "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y",
      ". \"$HOME/.cargo/env\"",
      "git clone https://github.com/scylladb/cql-stress.git && cd cql-stress",
      "cargo build --release",
      "echo \"cd /home/ubuntu/cql-stress\ncargo run --release --bin cql-stress-cassandra-stress -- mixed duration=6h cl=local_quorum keysize=100 'ratio(read=8,write=2)' -col n=5 size='FIXED(200)' -mode cql3 -rate throttle=${var.throttle} threads=${var.num_threads} -pop seq=1..1M -node ${local.scylla_ips}\" > start.sh",
      "sudo chmod +x start.sh",
      "sudo mv /home/ubuntu/cql-stress.service /etc/systemd/system/cql-stress.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl start cql-stress.service",
    ]
  }

  # Set up an SSH connection to each EC2 instance using the scyllaadm user and the private key. 
  # The coalesce function is used to select the public IP address of ScyllaDB Nodes.
  connection {
    type        = "ssh"
    user        = "ubuntu"
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

