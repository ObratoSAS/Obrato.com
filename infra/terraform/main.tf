terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "network" {
  source = "terraform-aws-modules/vpc/aws"
  version = "~> 5.1"

  name = "obrato-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
}

# TODO(high): parametrizar RDS PostgreSQL y Elasticache cuando se definan los entornos finales.
