#
# Set the following variables (mandatory)
#

# AWS credentials file
# Default location for Docker
# You need to change this value for local testing
variable "aws_creds_file" {
  description = "AWS credentials location"
  type        = string
  default     = "/app/.aws/credentials"
}

# AWS credentials file
variable "aws_creds_profile" {
  description = "AWS credentials profile"
  type        = string
  default     = ""
}

variable "region" {
  description = "Region of the cluster"
  type        = string
  default     = ""
}

# Amazon Machine Image (AMI) name
variable "monitoring_ami_name" {
  description = "AMI name for the EC2 instance"
  type        = string
  default     = "ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-20240326"
}

# Scylla AMI name
variable "scylla_ami_name" {
  description = "AMI name for the ScyllaDB EC2 instance"
  type        = string
  default     = "ScyllaDB Enterprise 2024.2*"
}

# Loader AMI name
variable "loader_ami_name" {
  description = "AMI name for the EC2 loader instance"
  type        = string
  default     = "ScyllaDB 5.4.0"
}

################################################

#
# The following variables are not required to be modified to run the demo
# but you can still modify them if you want to try a different setup
#

# Scylla instance type
variable "scylla_node_type" {
  description = "Type of the EC2 instance"
  type        = string
  default     = ""
}

# Loader instance type
variable "loader_instance_type" {
  description = "Type of the EC2 instance"
  type        = string
  default     = "i4i.12xlarge"
}

# Virtual Private Cloud (VPC) IP range
variable "custom_vpc" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# SUBNET Count
variable "subnet_count" {
  description = "Number of subnets"
  type        = string
  default     = "1"
}

# Amazon Machine Image (AMI) Username
variable "scylla_user" {
  description = "username for the ScyllaDB AMI"
  type        = string
  default     = "scyllaadm"
}

# Amazon Machine Image (AMI) Username
variable "instance_username_monitoring" {
  description = "username for the Monitoring AMI"
  type        = string
  default     = "ubuntu"
}

# Monitoring instance type
variable "monitoring_instance_type" {
  description = "Type of the EC2 instance"
  type        = string
  default     = "m5.4xlarge"
}

# Number of threads for the Cassandra stress tool
variable "num_threads" {
  description = "Number of threads for the Cassandra stress tool"
  type        = string
  default     = "350"
}

# Total number of operations to run
variable "num_of_ops" {
  description = "Total number of operations to run"
  type        = string
  default     = "5M"
}

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

# Environment name
variable "custom_name" {
  description = "Name for the ScyllaDB Enterprise cluster"
  type        = string
  default     = "ScyllaDB-Enterprise-Demo"
}


# Number of ScyllaDB  instances to create
variable "scylla_node_count" {
  description = "Number of ScyllaDB instances to create"
  type        = string
  default     = "3"
}

# Number of Loaders instances to create
variable "loader_node_count" {
  description = "Number of loader instances to create"
  type        = string
  default     = "3"
}

locals {
  scylla_ips = join(",", concat(aws_instance.scylladb_seed.*.private_ip, aws_instance.scylladb_nonseeds.*.private_ip))
}

# ScyllaDB Cloud API token
# Not needed for this demo, but needed by DEMO UI
variable "scylla_cloud_token" {
  description = "ScyllaDB Cloud API token"
  type        = string
  default     = ""
}