data "aws_availability_zones" "azs" {}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_instances" "scylladb" {
  filter {
    name   = "tag:Project"
    values = [var.custom_name]
  }

  filter {
    name   = "tag:Type"
    values = ["Scylla"]
  }
}
data "aws_vpc" "selected" {
  id = aws_vpc.custom_vpc.id
}
