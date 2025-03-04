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

data "aws_ami" "monitoring_ami" {
  most_recent      = true
  owners           = ["099720109477"]

  filter {
    name   = "name"
    values = [var.monitoring_ami_name]
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

data "aws_ami" "scylla_ami" {
  most_recent      = true
  owners           = ["158855661827"]

  filter {
    name   = "name"
    values = [var.scylla_ami_name]
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
