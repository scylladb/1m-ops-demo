#!/bin/bash

latest_branch=$(git ls-remote --heads https://github.com/scylladb/scylla-monitoring.git | grep 'refs/heads/branch-' | sort -t '-' -k 2,2V | tail -1 | awk '{print $2}' | cut -d '/' -f 3)
git clone --branch $latest_branch https://github.com/scylladb/scylla-monitoring.git