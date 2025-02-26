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
  cluster_id       = scylladbcloud_cluster.scylladbcloud.id
  datacenter       = scylladbcloud_cluster.scylladbcloud.datacenter
  peer_vpc_id      = aws_vpc.custom_vpc.id
  peer_cidr_blocks = [var.custom_vpc]
  peer_region      = data.aws_region.current.name
  peer_account_id  = data.aws_caller_identity.current.account_id
  allow_cql        = true
}

locals {
  scylla_account_id     = jsondecode(data.http.scylla_account_request.response_body)["data"]["accountId"]
  scylla_grafana_url    = jsondecode(data.http.scylla_grafana_url_request.response_body)["data"]["cluster"]["grafanaUrl"]
  scylla_version_parsed = join("-", slice(split(".", jsondecode(data.http.scylla_grafana_url_request.response_body)["data"]["cluster"]["scyllaVersion"]), 0, 2))

  template_file_init = templatefile("${path.module}/../terraform-data.tftpl", {
    monitoring_url  = split("/d/", local.scylla_grafana_url)[0]
    scylla_version  = local.scylla_version_parsed
    is_scylla_cloud = "true"
    scenario_steps  = "\"start_stress\", \"stop_stress\""
    demo            = "scylladb-cloud"
  })
}

resource "local_file" "grafana_urls" {
  content  = local.template_file_init
  filename = "${path.module}/../frontend/public/data/terraform-data.json"
}

# Generate private key file for Ansible
resource "local_file" "keyfile_ansible_config" {
  content  = <<-DOC
    -----BEGIN RSA PRIVATE KEY-----
    ${tls_private_key.private_key.private_key_pem}
    -----END RSA PRIVATE KEY-----

    DOC
  filename = "./ansible/key.pem"
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
  depends_on = [aws_instance.instance, aws_eip.eip, aws_eip_association.eip_association]
  content    = <<-DOC
    # Ansible inventory containing IP addresses from Terraform
    # Generated by Terraform configuration

    [stress]
    ${join("\n", aws_eip.eip.*.public_ip)}

    DOC
  filename   = "./ansible/inventory.ini"
}


data "http" "scylla_account_request" {
  url = "https://api.cloud.scylladb.com/account/default"

  # Optional request headers
  request_headers = {
    Accept        = "application/json"
    Authorization = "Bearer ${var.scylla_cloud_token}"
  }
}

data "http" "scylla_grafana_url_request" {
  url = "https://api.cloud.scylladb.com/account/${local.scylla_account_id}/cluster/${scylladbcloud_cluster.scylladbcloud.id}"

  # Optional request headers
  request_headers = {
    Accept        = "application/json"
    Authorization = "Bearer ${var.scylla_cloud_token}"
  }
}
