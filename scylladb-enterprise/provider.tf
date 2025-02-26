provider "aws" {
  region                   = var.region
  shared_credentials_files = ["/app/.aws/credentials"]
  profile                  = var.aws_creds_profile
}
