# Get started

Follow along this video to get started:

<p><iframe width="560" height="315" src="https://www.youtube.com/embed/3GM_SlPZLZo?si=mYpuGnivgFq2J6Dd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>

Or use the instructions outlined below to set up [AWS EC2](https://aws.amazon.com/ec2/) instances and [ScyllaDB Enterprise](https://www.scylladb.com/product/scylla-enterprise/) and run 1 million ops/sec workload.

## Prerequisites
* AWS account and CLI credentials (more information on acquiring the credentials [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) and [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html), for OKTA you can use [gimme-aws-creds](https://github.com/Nike-Inc/gimme-aws-creds))
* Terraform installed on your machine (installation instructions [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli))

### AWS permissions
Make sure that you have sufficient AWS permissions to create the following items:
* VPC
* Subnets
* Security groups
* EC2 instances

## Configure Terraform and set up infrastructure

1. Clone the repository:
    ```
    git clone https://github.com/scylladb/1m-ops-demo.git
    cd 1m-ops-demo/scylladb-enterprise/
    ```
1. Set the required items in `variables.tf`:
    ```terraform
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
    default     = "/home/user/Documents/key.pem"
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

    # Make sure the AMIs are available in your chosen region
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
    ```
1. Run Terraform:
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


