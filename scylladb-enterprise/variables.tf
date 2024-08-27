#
# Set the following variables (mandatory)
#

# AWS credentials file
variable "path_to_aws_cred_file" {
  description = "AWS credentials location"
  type        = string
  default     = "/home/user/.aws/credentials"
}

# AWS credentials file
variable "aws_creds_profile" {
  description = "AWS credentials profile"
  type        = string
  default     = "DeveloperAccessRole"
}

# SSH private key for EC2 instance access
variable "ssh_private_key" {
  description = "SSH private key location for EC2 instance access"
  type        = string
  default     = "/home/user/key.pem"
}

variable "aws_key_pair_name" {
  description = "Key pair name in AWS"
  type        = string
  default     = "key-pair"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

# Amazon Machine Image (AMI) ID
variable "monitoring_ami_id" {
  description = "AMI ID for the EC2 instance"
  type        = string
  default     = "ami-068cf3d51efeb20d6"
}

# Scylla (AMI) ID
variable "scylla_ami_id" {
  description = "AMI ID for the ScyllaDB EC2 instance"
  type        = string
  default     = "ami-0a4e6d1a9b982b961"
}

# Scylla (AMI) ID for Loader instance
variable "loader_ami_id" {
  description = "AMI ID for the EC2 loader instance"
  type        = string
  default     = "ami-027fdd99203b5e063"
}

################################################

#
# The following variables are not required to be modified to run the demo
# but you can still modify them if you want to try a different setup
#

# Scylla instance type
variable "scylla_instance_type" {
  description = "Type of the EC2 instance"
  type        = string
  default     = "i4i.2xlarge"
}

# Loader instance type
variable "loader_instance_type" {
  description = "Type of the EC2 instance"
  type        = string
  default     = "i4i.8xlarge"
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
variable "instance_username" {
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
variable "throttle" {
  description = "Throttling for the Cassandra stress tool (in ops/sec)"
  type        = string
  default     = "1200000/s"
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