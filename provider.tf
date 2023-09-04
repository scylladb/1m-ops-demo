provider "aws" {
  region                   = var.scylladb_region
  shared_credentials_files = ["${var.aws_creds}"]
  profile                  = "DeveloperAccessRole"
}