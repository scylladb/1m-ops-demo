# ScyllaDB Enterprise 1 million operations/second DEMO
This demo shows you how to set up infrastructure with Terraform and run a 1 million ops/sec load on a ScyllaDB Enterprise cluster. This repo is a great starting point for you to test ScyllaDB Enterprise under heavy load and simulate your own workload you expect ScyllaDB to handle. [Watch the video tutorial here!]()

## Infrastructure elements
* ScyllaDB Enterprise
* Amazon Web Services (AWS) EC2 instances
  * three "loader" machines
  * three ScyllaDB Enterprise machines
  * one ScyllaDB Monitoring machine

## Prerequisites
* AWS account and CLI credentials (more information on acquiring the credentials [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) and [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html), for OKTA you can use [gimme-aws-creds](https://github.com/Nike-Inc/gimme-aws-creds))
* Terraform installed on your machine (installation instructions [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli))

### AWS permissions
Make sure that you have sufficient AWS permissions to create the following items:
* VPC
* Subnets
* Security groups
* EC2 instances


## Get started
Clone the repository:
```
git clone https://github.com/scylladb/1m-ops-demo.git
cd 1m-ops-demo/scylladb-enterprise/
```

First, set the required items in `variables.tf`:
```terraform
#
# Set the following variables (mandatory)
#

# ScyllaDB Cloud API token
variable "scylla_cloud_token" {
  description = "ScyllaDB Cloud API token"
  type        = string
  default     = "ADD-YOUR-API-TOKEN-HERE"
}

# ScyllaDB Cloud region
variable "scylla_cloud_region" {
  description = "ScyllaDB Cloud region of the cluster"
  type        = string
  default     = "us-east-1"
}

# SSH private key for EC2 instance access
variable "ssh_private_key" {
  description = "SSH private key location for EC2 instance access"
  type        = string
  default     = "/home/user/Documents/your-private-key.pem"
}

variable "aws_key_pair" {
  description = "Key pair name in AWS"
  type        = string
  default     = "my-key-pair"
}

# AWS credentials file
variable "aws_creds" {
  description = "AWS credentials location"
  type        = string
  default     = "/home/user/.aws/credentials"
}
```

Start setting up infrastructure with Terraform:
```bash
terraform init
terraform plan
terraform apply

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

[...]

Apply complete! Resources: 20 added, 0 changed, 0 destroyed.

Outputs:

monitoring_url = "http://<ip-address>:3000"
scylla_ips = "10.0.0.74,10.0.0.73,10.0.0.145"
scylla_public_ips = "18.222.111.226,18.222.163.223,3.145.73.47"
```

Setting up the infrastructure takes 4+ minutes. Once Terraform is finished, go to the ScyllaDB Monitoring page (Terraform outputs the URL).

After finishing the demo, destroy the infrastructure:
```
terraform destroy
```
