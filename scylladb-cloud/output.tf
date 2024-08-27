output "PublicIP" {
  value = ["${aws_instance.instance.*.public_ip}"]
}
output "CQL_PASS" {
  value     = data.scylladbcloud_cql_auth.scylla.password
  sensitive = true
}

# Output the VPC peering connection ID
output "scylladbcloud_vpc_peering_connection_id" {
  value = scylladbcloud_vpc_peering.scylladbcloud.connection_id
}

// Output the private IP addresses of the nodes
output "scylladbcloud_cluster_ips" {
  value = scylladbcloud_cluster.scylladbcloud.node_private_ips
}

// Output the dns names of the nodes
output "scylladbcloud_dns_names" {
  value = scylladbcloud_cluster.scylladbcloud.node_dns_names
}

output "scylladbcloud_datacenter" {
  value = scylladbcloud_cluster.scylladbcloud.datacenter
}

// Output the CQL password
output "scylladbcloud_cql_password" {
  value     = data.scylladbcloud_cql_auth.scylla.password # Get the CQL password for the cluster
  sensitive = true                                        # Mark the output as sensitive so it won't be shown in logs or output
}
