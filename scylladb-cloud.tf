# Declare the ScyllaDB Cloud provider
terraform {
  required_providers {
    scylladbcloud = {
      source = "registry.terraform.io/scylladb/scylladbcloud"
    }
  }
}

# Set up the ScyllaDB Cloud provider with your API token
provider "scylladbcloud" {
  token = var.scylla_cloud_token
}

# Create a ScyllaDB Cloud cluster
resource "scylladbcloud_cluster" "scylladbcloud" {
  name               = var.custom_name              # Set the cluster name
  region             = data.aws_region.current.name # Get the AWS region name where you want to launch the cluster
  node_count         = var.scylla_node_count        # Set the number of nodes in the cluster
  node_type          = var.scylla_node_type         # Set the instance type for the cluster nodes
  cidr_block         = "172.31.0.0/16"              # Set the CIDR block for the VPC
  cloud              = "AWS"                        # Set the cloud provider to AWS
  enable_vpc_peering = true                         # Enable VPC peering
  enable_dns         = true                         # Enable DNS
}

# Output the cluster ID
output "scylladbcloud_cluster_id" {
  value = scylladbcloud_cluster.scylladbcloud.id
}

# Output the datacenter where the cluster was launched
output "scylladbcloud_cluster_datacenter" {
  value = scylladbcloud_cluster.scylladbcloud.datacenter
}

# Set up VPC peering with the ScyllaDB Cloud cluster and a custom VPC
resource "scylladbcloud_vpc_peering" "scylladbcloud" {
  cluster_id      = scylladbcloud_cluster.scylladbcloud.id
  datacenter      = scylladbcloud_cluster.scylladbcloud.datacenter
  peer_vpc_id     = aws_vpc.custom_vpc.id
  peer_cidr_blocks = [var.custom_vpc]
  peer_region     = data.aws_region.current.name
  peer_account_id = data.aws_caller_identity.current.account_id
  allow_cql       = true
}

