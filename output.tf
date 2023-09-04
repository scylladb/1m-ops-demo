output "PublicIP" {
  value = ["${aws_instance.instance.*.public_ip}"]
}
output "CQL_PASS" {
  value     = data.scylladbcloud_cql_auth.scylla.password
  sensitive = true
}