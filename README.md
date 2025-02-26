# ScyllaDB 1 million operations/second DEMOs

This repository contains Terraform and Ansible based projects to help you
set up DEMOs and POCs with ScyllaDB in a cloud environment.

Currently supported DEMOs:
* [ScyllaDB Cloud 1 million operations/second (AWS and ScyllaDB Cloud account needed)](/scylladb-cloud)
* [ScyllaDB Enterprise 1 million operations/second (AWS account needed)](/scylladb-enterprise)
* [Scaling from 3 to 6 nodes (AWS account needed))](/tablets-scaling)


## Prerequisites
* [AWS CLI](https://aws.amazon.com/cli/)
* [Docker](https://docker.com)
* [ScyllaDB Cloud API key](https://cloud.scylladb.com/)

## Usage
1. Clone the repository
    ```
    git clone https://github.com/scylladb/1m-ops-demo.git
    cd 1m-ops-demo/
    ```
1. Make sure AWS CLI is configured properly, and know the location of the credentials file (e.g. `~/.aws/credentials`)
1. Edit `config.py`
    ```json
    {
        "aws_creds_file": "~/.aws/credentials",
        "region": "us-east-1",
        "scylla_cloud_token": "API-TOKEN"
    }
  
    ```
1. Run the web app (by default, it uses port 5000)
    ```bash
    ./build_and_run.sh 
    ```
1. Open DEMO UI application
    
    Go to http://0.0.0.0:5000
1. Select a demo you want to try (this will run `terraform init` under the hood)
    ![demo ui](/docs/source/_static/img/demo_ui.jpg)
1. (Optional) Configure cluster size and workload settings on the left side
    ![demo ui workload](/docs/source/_static/img/demo_ui2.jpg)
1. Hit `APPLY` (this runs `terraform apply`)
1. Keep an eye on the console output to see when Terraform finishes
1. Click on the different dashboard tabs to monitor the cluster.
1. If you are done, don't forget to run `DESTROY` to remove infrastructure elements and avoid unnecessary costs.

## Usage tips
* In case you need to manually access `terraform`, you can always access it through the container's shell (keep in mind, that you need to change to a directory that contains the TF files):
    ```bash
    docker exec -it scylla-demo sh
    cd <demo-folder>
    ```
* To run `terraform apply` from within the container: 
    ```bash
    terraform apply -var-file=user.tfvars.json -auto-approve
    ```
* To run `terraform destroy` from within the container: 
    ```bash
    terraform destroy -var-file=user.tfvars.json -auto-approve
    ```
* You can change the underlying Terraform implementation by stopping the container, making your changes then running `build_and_run.sh` script again.
* If Terraform fails after spinning up some parts of the infrastructure, you can do two things:
    * Either just click the `DESTROY` button, fix the problem, then run `build_and_run.sh` again or
    * Open the container's shell, fix the problem, and run `terraform apply -var-file=user.tfvars.json -auto-approve`
* If you want to install some package using the container's shell, you can use `apk add <package-name>` (the image is based on `Alpine`)


## Known issues
* Some regions may not work properly if the used AMI is not available in that region - working on a fix

## Local development
Requirements:
* NodeJS 22 (npm install -g node@22 or nvm install 22)
* Python 3

1. Install Python packages and start Flask server
    ```bash
    virtualenv env && source env/bin/activate
    pip install -r reqiurements.txt
    python app.py
    ```
1. Install frontend requirements and start dev server:
    ```
    cd frontend
    npm install
    npm run dev
    ```

## Relevant links
* [ScyllaDB docs](https://docs.scylladb.com/stable/)
* [ScyllaDB Cloud](https://cloud.scylladb.com)