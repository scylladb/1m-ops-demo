#!/bin/bash

sudo apt-get install unzip
cd /var/lib/scylla/data/keyspace1/standard1-*/upload
wget https://scylla-devrel.s3.us-east-2.amazonaws.com/tablets-sample-data/scylla.zip
unzip scylla.zip
rm scylla.zip
sudo chown -R scylla:scylla *