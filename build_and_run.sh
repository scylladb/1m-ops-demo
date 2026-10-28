#!/bin/bash
# Stop at the first failure, so a failed image build isn't followed by
# a docker run of a missing or stale image.
set -e

# Check if the config file exists
CONFIG_FILE="config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Config file '$CONFIG_FILE' not found!"
    exit 1
fi


# Read JSON values
extract_value() {
    # sed instead of grep -P, which macOS grep doesn't support
    sed -n 's/.*"'"$1"'"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$CONFIG_FILE"
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
# label=disable: on SELinux hosts (Fedora, RHEL) the container can't read the
# mounted credentials file otherwise; it has no effect elsewhere
docker run -p 5000:5000 --name scylla-demo --rm --security-opt label=disable -v $aws_creds_file:/app/.aws/credentials -d scylla-demo
