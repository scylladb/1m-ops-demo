# ScyllaDB X Cloud — Terraform Example

This directory contains a Terraform configuration for creating a ScyllaDB X Cloud cluster with autoscaling. X Cloud uses a tablets-based architecture that scales compute and storage dynamically — you define the scaling policy, the platform handles capacity decisions.

---

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/downloads) >= 0.13
- A [ScyllaDB Cloud](https://cloud.scylladb.com) account
- A ScyllaDB Cloud API token (see below)

---

## Getting an API Token

1. Log in to [cloud.scylladb.com](https://cloud.scylladb.com)
2. Navigate to **Settings → API Keys**
3. Create a new key and copy the token

---

## Setup

```bash
# Clone the repository
git clone https://github.com/scylladb/1m-ops-demo
cd 1m-ops-demo/terraform/xcloud

# Initialize the provider
terraform init

# Preview the changes
terraform plan

# Apply
terraform apply
```

---

## Providing Your API Token

**Option 1 — Environment variable (recommended):**

```bash
export TF_VAR_scylladb_token="your-token-here"
```

**Option 2 — `terraform.tfvars` file (already in `.gitignore`):**

```hcl
# terraform.tfvars
scylladb_token = "your-token-here"
```

> ⚠️ Never commit your API token. The `.gitignore` in this directory already excludes `*.tfvars` and `.terraform/`.

---

## Key Variables

| Variable | Default | Description |
|---|---|---|
| `scylladb_token` | _(required)_ | ScyllaDB Cloud API token |
| `cluster_name` | `my-xcloud-cluster` | Cluster display name |
| `cloud_provider` | `AWS` | Cloud provider (`AWS` or `GCP`) |
| `region` | `us-east-1` | Deployment region |
| `cidr_block` | `172.31.0.0/16` | VPC CIDR for the cluster |
| `instance_families` | `["i8g"]` | Instance family for autoscaling |
| `min_storage_gb` | `500` | Minimum physical storage floor (GB) |
| `target_utilization` | `0.8` | Target storage utilization (0.7–0.9) |
| `min_vcpus` | `6` | Minimum vCPU floor |

### Scaling parameters in detail

**`instance_families`** — X Cloud scales within a single instance family. The autoscaler picks specific instance sizes within that family. Keeping this broad (e.g., just `["i8g"]`) gives the scaler the most flexibility.

**`target_utilization`** — When storage utilization exceeds this threshold by more than 5%, the cluster scales out. When it falls more than 5% below, the cluster scales in. For write-intensive workloads, values below 0.85 are recommended to leave room for compaction.

**`min_storage_gb`** and **`min_vcpus`** — These are floors. The cluster will not scale below these values, regardless of load. Useful for ensuring a consistent latency baseline or preventing excessive scale-in.

---

## Outputs

After `terraform apply`, the following values are available:

```bash
terraform output cluster_id       # numeric cluster ID
terraform output datacenter       # e.g. AWS_US_EAST_1
terraform output node_dns_names   # hostnames for driver configuration
```

---

## Further Reading

- [ScyllaDB Cloud Terraform Provider](https://registry.terraform.io/providers/scylladb/scylladbcloud/latest/docs)
- [ScyllaDB Cloud Documentation](https://cloud.docs.scylladb.com)
- [X Cloud Overview](https://cloud.docs.scylladb.com/stable/xcloud/)
