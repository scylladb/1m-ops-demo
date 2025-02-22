provider "aws" {
  region                   = var.region
  shared_credentials_files = ["${var.aws_creds_file}"]
  profile                  = "${var.aws_creds_profile}"
}
