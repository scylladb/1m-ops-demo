# Get started

Follow along this video to get started:

<p><iframe width="560" height="315" src="https://www.youtube.com/embed/SXwNVrU93IM?si=ffv6jugdENamMQG0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>

Or use the instructions outlined below to set up [AWS EC2](https://aws.amazon.com/ec2/) instances and [ScyllaDB Cloud](https://cloud.scylladb.com/) and run 1 million ops/sec workload.

## Prerequisites
* AWS account and CLI credentials (more information on acquiring the credentials [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) and [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html), for OKTA you can use [gimme-aws-creds](https://github.com/Nike-Inc/gimme-aws-creds))
* ScyllaDB Cloud API token (get your API token [here](https://cloud.docs.scylladb.com/stable/api-docs/api-get-started.html))
* Terraform installed on your machine (installation instructions [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli))

### AWS permissions
Make sure that you have sufficient AWS permissions to create the following items:
* VPC
* Subnets
* Security groups
* EC2 instances (three)

## Configure Terraform and set up infrastructure

1. Clone the repository:
    ```
    git clone https://github.com/scylladb/scylladb-1m-ops-demo.git
    cd scylladb-1m-ops-demo/
    ```
1. Set the required items in `variables.tf`:
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
    default     = "eu-north-1"
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

    Apply complete! Resources: 23 added, 0 changed, 0 destroyed.
    ```

Setting up the infrastructure takes 15+ minutes. Once Terraform is finished it takes another 2-3 minutes to reach 1M ops/sec.

Go to [ScyllaDB Cloud console](https://cloud.scylladb.com/clusters/list), select your newly created cluster `ScyllaDB-Cloud-Demo` and open `Monitoring` to see the workload live:
![ScyllaDB Monitoring 1 million ops/sec](../../scylladb-cloud/images/scylladb-monitoring.png) After finishing the demo, don't forget to destroy the infrastructure to avoid unnecessary costs:
```
terraform destroy
```


