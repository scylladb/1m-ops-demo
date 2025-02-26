
#
# Set the following variables (mandatory)
#

# ScyllaDB Cloud API token
variable "scylla_cloud_token" {
  description = "ScyllaDB Cloud API token"
  type        = string
  default     = ""
}

# ScyllaDB Cloud region
variable "region" {
  description = "ScyllaDB Cloud region of the cluster"
  type        = string
  default     = ""
}

# AWS credentials file
# Default location for Docker
# You need to change this value for local testing
variable "aws_creds_file" {
  description = "AWS credentials location"
  type        = string
  default     = "/app/.aws/credentials"
}

# AWS Profile to Use
variable "aws_creds_profile" {
  description = "AWS Profile to Use"
  type        = string
  default     = ""
}
################################################

#
# The following variables are not required to be modified to run the demo
# but you can still modify them if you want to try a different setup
#

# Throttling for the Cassandra stress tool
variable "loader_ops_per_sec" {
  description = "Throttling for the Cassandra stress tool (in ops/sec)"
  type        = string
  default     = ""
}

variable "loader_read_ratio" {
  description = "Read ratio"
  type        = string
  default     = "7"
}

variable "loader_write_ratio" {
  description = "Write ratio"
  type        = string
  default     = "3"
}


# Total number of operations to run
variable "num_of_ops" {
  description = "Total number of operations to run"
  type        = string
  default     = "5M"
}

# Throttling for the Cassandra stress tool
variable "throttle" {
  description = "Throttling for the Cassandra stress tool (in ops/sec)"
  type        = string
  default     = "1200000/s "
}

# EC2 instance type
variable "instance_type" {
  description = "Type of the EC2 instance"
  type        = string
  default     = "i4i.12xlarge"
}

# Number of Loader instances to create
variable "loader_node_count" {
  description = "Number of Loader instances to create"
  type        = string
  default     = "3"
}

# ScyllaDB Cloud instance type
variable "scylla_node_type" {
  description = "Type of ScyllaDB Cloud instance (3,6,9,12,15,18,21)"
  type        = string
  default     = "i4i.4xlarge"
}

# ScyllaDB Cloud user
variable "scylla_user" {
  description = "ScyllaDB Cloud user"
  type        = string
  default     = "scylla"
}

# Environment name
variable "custom_name" {
  description = "Name for the ScyllaDB Cloud environment"
  type        = string
  default     = "ScyllaDB-Cloud-Demo"
}

# Virtual Private Cloud (VPC) IP range
variable "custom_vpc" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# EC2 instance tenancy
variable "instance_tenancy" {
  description = "EC2 instance tenancy, default or dedicated"
  type        = string
  default     = "default"
}

# Amazon Machine Image (AMI) ID
variable "ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-0665aae77b073ae42"
}

# Number of ScyllaDB Cloud instances to create
variable "scylla_node_count" {
  description = "Number of ScyllaDB Cloud instances to create"
  type        = string
  default     = "3"
}

locals {
  scylla_ips  = (join(",", [for s in scylladbcloud_cluster.scylladbcloud.node_dns_names : format("%s", s)]))
  scylla_pass = data.scylladbcloud_cql_auth.scylla.password
}
