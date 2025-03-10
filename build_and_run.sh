#!/bin/bash

# Check if the config file exists
CONFIG_FILE="config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Config file '$CONFIG_FILE' not found!"
    exit 1
fi


# Read JSON values
extract_value() {
    grep -oP '"'"$1"'"\s*:\s*"\K[^"]+' "$CONFIG_FILE"
}
aws_creds_file=$(extract_value "aws_creds_file")
aws_creds_profile=$(extract_value "aws_creds_profile")
region=$(extract_value "region")
scylla_cloud_token=$(extract_value "scylla_cloud_token")

# Build image
docker build -t scylla-demo .

# Run the container
# container gets deleted when stops
# mounting the aws credentials file
# running on port 5000
docker run -p 5000:5000 --name scylla-demo --rm -v $aws_creds_file:/app/.aws/credentials -d scylla-demo
