terraform {
  required_providers {
    scylladbcloud = {
      source  = "registry.terraform.io/scylladb/scylladbcloud"
      version = "~> 0.3"
    }
  }
  required_version = ">= 0.13"
}

provider "scylladbcloud" {
  token = var.scylladb_token
}

resource "scylladbcloud_cluster" "xcloud" {
  name       = var.cluster_name
  cloud      = var.cloud_provider
  region     = var.region
  cidr_block = var.cidr_block

  scaling {
    instance_families = var.instance_families

    storage_policy {
      min_gb             = var.min_storage_gb
      target_utilization = var.target_utilization
    }

    vcpu_policy {
      min = var.min_vcpus
    }
  }
}
