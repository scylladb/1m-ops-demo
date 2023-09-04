data "aws_availability_zones" "azs" {}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "scylladbcloud_cql_auth" "scylla" {
  cluster_id = scylladbcloud_cluster.scylladbcloud.id
}
