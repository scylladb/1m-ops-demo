# ScyllaDB Tablets DEMO
This project walks you through the following scenario:
1. Starting off with 3 ScyllaDB nodes
1. Spike in the number of requests
1. Add 3 additional ScyllaDB nodes to handle requests
1. Request volume goes down
1. Remove 3 nodes

## Requirements
* AWS account
* [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
* [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
* Python

## Usage
1. Clone the repository
    ```
    git clone https://github.com/scylladb/1m-ops-demo.git
    cd 1m-ops-demo/tablets/scaling
    ```
1. Set your variables in `variables.tf`
1. Set up EC2 instances on AWS (takes 4+ minutes)
    ```bash
    terraform init
    terraform plan
    terraform apply
    ```
1. Start Python server
    
    Install requirements in a new environment, and start the server:
    ```
    virtualenv env
    source env/bin/activate
    pip install -r requirements.txt
    python app.py
    ```

    Output:
    ```
    * Serving Flask app 'app'
    * Debug mode: off
    WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
    * Running on all addresses (0.0.0.0)
    * Running on http://127.0.0.1:5000
    * Running on http://192.168.0.47:5000
    ```
1. Open the DEMO UI
    ```
    http://127.0.0.1:5000
    ```