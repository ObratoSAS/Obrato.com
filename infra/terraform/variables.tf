variable "aws_region" {
  description = "Región AWS donde desplegar Obrato"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR principal de la VPC"
  type        = string
}

variable "availability_zones" {
  description = "Lista de zonas de disponibilidad"
  type        = list(string)
}

variable "public_subnets" {
  description = "Subredes públicas"
  type        = list(string)
}

variable "private_subnets" {
  description = "Subredes privadas"
  type        = list(string)
}
