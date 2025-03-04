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

# AWS credentials profile
variable "aws_creds_profile" {
  description = "AWS credentials profile"
  type        = string
  default     = ""
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = ""
}

# Number of threads for the CQL stress tool
variable "num_threads" {
  description = "Number of threads for the CQL stress tool"
  type        = string
  default     = "800"
}

# Throttling for the CQL stress tool
variable "throttle" {
  description = "Throttling for the cQL stress tool (in ops/sec)"
  type        = string
  default     = "1200000/s"
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

# Scylla instance type
variable "scylla_node_type" {
  description = "Type of the EC2 instance"
  type        = string
  default     = "i4i.2xlarge"
}

# Loader instance type
variable "loader_instance_type" {
  description = "Type of the EC2 instance"
  type        = string
  default     = "c5.4xlarge" #"i4i.8xlarge"
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

# Virtual Private Cloud (VPC) IP range
variable "custom_vpc" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}
# SUBNET Count
variable "subnet_count" {
  description = "Type of the EC2 instance"
  type        = string
  default     = "1"
}

# Amazon Machine Image (AMI) Username
variable "instance_username" {
  description = "username for the ScyllaDB AMI"
  type        = string
  default     = "ubuntu"
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
  default     = "m5.4xlarge" #"m5.2xlarge"
}

# Environment name
variable "custom_name" {
  description = "Name for the ScyllaDB Cloud environment"
  type        = string
  default     = "ScyllaDB-Tablets-DEMO"
}


# Number of ScyllaDB  instances to create
variable "scylla_node_count" {
  description = "Number of ScyllaDB instances to create"
  type        = string
  default     = "6"
}

# Number of Loaders instances to create
variable "loader_node_count" {
  description = "Number of loader instances to create"
  type        = string
  default     = "1"
}

locals {
  scylla_ips = join(",", concat(aws_instance.scylladb_seed.*.private_ip, aws_instance.scylladb_nonseeds.*.private_ip))
}