output "cluster_id" {
  description = "ScyllaDB Cloud cluster ID"
  value       = scylladbcloud_cluster.xcloud.cluster_id
}

output "datacenter" {
  description = "Cluster datacenter name"
  value       = scylladbcloud_cluster.xcloud.datacenter
}

output "node_dns_names" {
  description = "DNS names of cluster nodes"
  value       = scylladbcloud_cluster.xcloud.node_dns_names
}
