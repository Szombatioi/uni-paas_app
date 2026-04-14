resource "kubernetes_secret" "fotoalbum_secrets" {
  metadata {
    name      = "fotoalbum-secrets"
    namespace = var.namespace
  }

  data = {
  DB_PASSWORD      = var.db_password
  DB_USERNAME      = var.db_username
  JWT_SECRET       = var.jwt_secret
  MINIO_ACCESS     = var.minio_access
  MINIO_SECRET     = var.minio_secret
  DB_HOST          = "fotoalbum-db"        # átköltöztetve secretből
  DB_PORT          = "5432"
  DB_NAME          = var.db_name
  DB_TYPE          = var.db_type
  DB_SSL           = var.db_ssl
  S3_ACCESS_KEY    = var.minio_access    
  S3_SECRET_KEY    = var.minio_secret
  S3_ENDPOINT      = var.s3_endpoint
  S3_IMAGE_ENDPOINT = var.s3_image_endpoint
  S3_BUCKET        = var.s3_bucket
  CORS_ORIGINS     = var.cors_origins
  NEXT_PUBLIC_BACKEND_URL = var.next_public_backend_url
}

  type = "Opaque"
}

resource "kubernetes_config_map" "fotoalbum_config" {
  metadata {
    name      = "fotoalbum-config"
    namespace = var.namespace
  }

  data = {
    DB_HOST = "fotoalbum-db"
    DB_PORT = "5432"
    DB_NAME = var.db_name
  }
}