#!/bin/bash
set -e

# Template variables
SCYLLA_SERVERS="${scylla_servers}"
CLUSTER_NAME="${CLUSTER_NAME}"
DC_NAME="${DC_NAME}"

echo "${scylla_servers}"

# Create scylla_servers.yaml file with monitoring targets and labels
cat <<EOF > /home/ubuntu/scylla-monitoring/prometheus/scylla_servers.yml
# Scylla servers configuration
- targets:
${scylla_servers}
  labels:
       cluster: ${CLUSTER_NAME}
       dc: ${DC_NAME}
EOF