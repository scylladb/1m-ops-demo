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
1. Install DEMO UI application dependencies

    Make sure you are in the root folder of the project.
    
    Install backend dependencies (virtual environment is recommended):
    ```bash
    virtualenv env && source env/bin/activate && pip install -r requirements.txt
    ```

    Install frontend dependencies (use `npm` or `yarn`):
    ```bash
    cd frontend
    npm install
    ```
1. Edit `config.js` to set Terraform variables:
    ```json
    {
        "aws_creds_file": "/home/user/.aws/credentials",
        "aws_creds_profile": "DeveloperAccessRole",
        "ssh_private_key": "/home/user/key.pem",
        "aws_key_pair": "key-par",
        "region": "us-east-1",
        "scylla_cloud_token": "API-TOKEN"
    }
  
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
1. Select a demo you want to try (this will run `terraform init` under the hood)
    ![demo ui](/docs/source/_static/img/demo_ui.jpg)
1. (Optional) Configure cluster size and workload settings on the left side
    ![demo ui workload](/docs/source/_static/img/demo_ui2.jpg)
1. Hit `APPLY` (this runs `terraform apply`)
1. Keep an eye on the console output to see when Terraform finishes
1. Click on the different dashboard tabs to monitor the cluster.
1. If you are done, don't forget to run `DESTROY` to remove infrastructure elements and avoid unnecessary costs.


## Relevant links
* [ScyllaDB docs](https://docs.scylladb.com/stable/)
* [ScyllaDB Cloud](https://cloud.scylladb.com)