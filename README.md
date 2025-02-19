# ScyllaDB 1 million operations/second DEMOs

This repository contains Terraform and Ansible based projects to help you
set up DEMOs and POCs with ScyllaDB in a cloud environment.

Currently supported DEMOs:
* [ScyllaDB Cloud 1 million operations/second (AWS and ScyllaDB Cloud account needed)](/scylladb-cloud)
* [ScyllaDB Enterprise 1 million operations/second (AWS account needed)](/scylladb-enterprise)
* [Scaling from 3 to 6 nodes (AWS account needed))](/tablets-scaling)


## Prerequisites
* [Terraform](https://developer.hashicorp.com/terraform/install)
* [Python 3](https://www.python.org/downloads/)
* [NodeJS](https://nodejs.org/en/download)
* [AWS CLI](https://aws.amazon.com/cli/) and [ScyllaDB Cloud API key](https://cloud.scylladb.com/)

## Usage
1. Clone the repository
    ```
    git clone https://github.com/scylladb/1m-ops-demo.git
    ```
1. Open the DEMO folder that you want to run (e.g. for ScyllaDB Cloud 1M ops/sec demo):
    ```
    cd scylladb-cloud
    ```
1. Edit the `variables.tf` file, for example:
    ```terraform
    # ScyllaDB Cloud API token
    variable "scylla_cloud_token" {
    description = "ScyllaDB Cloud API token"
    type        = string
    default     = "YOUR-API-TOKEN"
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
    default     = "key.pem"
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

    # AWS Profile to Use
    variable "aws_profile" {
    description = "AWS Profile to Use"
    type        = string
    default     = "DeveloperAccessRole"
    }
    ```
1. Run Terraform

    Initialize Terraform project:
    ```
    terraform init
    ```
    Review infrastrcuture that Terraform is planning to build out:
    ```
    terraform plan
    ```
    Finally, start Terraform:
    ```
    terraform apply
    ```
    Wait for Terraform to finish setting up
1. Install DEMO UI application dependencies

    Make sure your are in the root folder.
    
    Install backend dependencies (virtual environment is recommended):
    ```bash
    virtualenv env && source env/bin/activate && pip install -r requirements.txt
    ```

    Install frontend dependencies (use `npm` or `yarn`):
    ```bash
    cd frontend
    npm install
    ```
1. Run DEMO UI application
    
    Start backend
    ```bash
    python app.py
    ```

    Start frontend
    ```bash
    cd frontend
    npm run dev 
    ```
1. Open DEMO UI application
    
    Go to http://localhost:5173
    ![demo ui](/docs/source/_static/img/demo_ui.png)
1. Click through the scenarios one by one.


## Relevant links
* [ScyllaDB docs](https://docs.scylladb.com/stable/)