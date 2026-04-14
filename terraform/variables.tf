variable "openshift_api_url" {
  description = "OpenShift API szerver URL"
  type        = string
}

variable "openshift_token" {
  description = "Service Account token"
  type        = string
  sensitive   = true
}

variable "namespace" {
  description = "OpenShift project neve"
  type        = string
  default     = "fotoalbum"
}

variable "frontend_image" {
  description = "Frontend image tag"
  type        = string
}

variable "backend_image" {
  description = "Backend image tag"
  type        = string
}

variable "auth_image" {
  description = "Auth service image tag"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL jelszó"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "PostgreSQL adatbázis neve"
  type        = string
  default     = "fotoalbum"
}

variable "db_username" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

# variable "minio_access" {
#   type      = string
#   sensitive = true
# }

# variable "minio_secret" {
#   type      = string
#   sensitive = true
# }

variable "db_type" {
  type    = string
  default = "postgres"
}

variable "db_ssl" {
  type    = string
  default = "false"
}

variable "s3_access_key" {
  type      = string
  sensitive = true
}

variable "s3_secret_key" {
  type      = string
  sensitive = true
}

variable "s3_endpoint" {
  type = string
}

variable "s3_image_endpoint" {
  type = string
}

variable "s3_bucket" {
  type = string
}

variable "cors_origins" {
  type = string
}

variable "auth_endpoint" {
  type    = string
  default = "http://fotoalbum-auth:8888"
}

variable "next_public_backend_url" {
  description = "Backend publikus URL-je a frontendnek"
  type        = string
}