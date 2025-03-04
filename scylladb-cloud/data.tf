data "aws_availability_zones" "azs" {}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "scylladbcloud_cql_auth" "scylla" {
  cluster_id = scylladbcloud_cluster.scylladbcloud.id
}

data "aws_ami" "loader_ami" {
  most_recent      = true
  owners           = ["158855661827"]

  filter {
    name   = "name"
    values = [var.loader_ami_name]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}