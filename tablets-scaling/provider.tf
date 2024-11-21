provider "aws" {
  region                   = var.aws_region
  shared_credentials_files = ["${var.path_to_aws_cred_file}"]
  profile                  = var.aws_creds_profile
}
