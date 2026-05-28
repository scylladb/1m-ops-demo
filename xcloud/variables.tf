variable "scylladb_token" {
  description = "ScyllaDB Cloud API token"
  type        = string
  sensitive   = true
}

variable "cluster_name" {
  description = "Name of the ScyllaDB X Cloud cluster"
  type        = string
  default     = "my-xcloud-cluster"
}

variable "cloud_provider" {
  description = "Cloud provider (AWS or GCP)"
  type        = string
  default     = "AWS"
}

variable "region" {
  description = "Cloud region"
  type        = string
  default     = "us-east-1"
}

variable "cidr_block" {
  description = "CIDR block for the cluster network"
  type        = string
  default     = "172.31.0.0/16"
}

variable "instance_families" {
  description = "Instance families for autoscaling (within one family)"
  type        = list(string)
  default     = ["i8g"]
}

variable "min_storage_gb" {
  description = "Minimum physical storage in GB"
  type        = number
  default     = 500
}

variable "target_utilization" {
  description = "Target storage utilization (0.7-0.9)"
  type        = number
  default     = 0.8
}

variable "min_vcpus" {
  description = "Minimum vCPU count"
  type        = number
  default     = 6
}
