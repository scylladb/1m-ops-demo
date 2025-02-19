#!/bin/bash

threads=${1:-100}   
read_ratio=${2:-7}   
write_ratio=${3:-3}  
node=${4:-"node"}
user=${5:-"scylla"}
pass=${6:-"pass"}

# Create schema and load initial dataset
cargo run --release --bin cql-stress-cassandra-stress -- write n=10000 cl=local_quorum keysize=100 -rate throttle=10000/s threads="$threads" -pop seq=1..10000 -mode user="$user" password="$pass" -node "$node"

# Start stress
cargo run --release --bin cql-stress-cassandra-stress -- mixed duration=6h cl=local_quorum keysize=100 'ratio(read='$read_ratio',write='$write_ratio')' -rate threads="$threads" -pop seq=1..10000 -mode user="$user" password="$pass" -node "$node"
