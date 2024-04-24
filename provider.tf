provider "aws" {
  region                   = var.scylla_cloud_region
  shared_credentials_files = ["${var.aws_creds}"]
  profile                  = "${var.aws_profile}"
}
