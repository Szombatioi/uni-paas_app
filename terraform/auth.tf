resource "kubernetes_deployment" "auth" {
  metadata {
    name      = "fotoalbum-auth"
    namespace = var.namespace
    labels = {
      app = "fotoalbum-auth"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "fotoalbum-auth"
      }
    }

    template {
      metadata {
        labels = {
          app = "fotoalbum-auth"
        }
      }

      spec {
        container {
          name  = "fotoalbum-auth"
          image = var.auth_image

          port {
            container_port = 8888
          }

          env {
            name  = "PORT"
            value = "8888"
          }

          env {
            name = "DB_HOST"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.fotoalbum_config.metadata[0].name
                key  = "DB_HOST"
              }
            }
          }

          env {
            name = "DB_PORT"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.fotoalbum_config.metadata[0].name
                key  = "DB_PORT"
              }
            }
          }

          env {
            name = "DB_NAME"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.fotoalbum_config.metadata[0].name
                key  = "DB_NAME"
              }
            }
          }

          env {
            name = "DB_USERNAME"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "DB_USERNAME"
              }
            }
          }

          env {
            name = "DB_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "DB_PASSWORD"
              }
            }
          }

          env {
            name = "DB_TYPE"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "DB_TYPE"
              }
            }
          }

          env {
            name = "DB_SSL"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "DB_SSL"
              }
            }
          }

          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "JWT_SECRET"
              }
            }
          }

          env {
            name = "CORS_ORIGINS"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "CORS_ORIGINS"
              }
            }
          }

          resources {
            requests = {
              memory = "128Mi"
              cpu    = "100m"
            }
            limits = {
              memory = "256Mi"
              cpu    = "300m"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "auth" {
  metadata {
    name      = "fotoalbum-auth"
    namespace = var.namespace
  }

  spec {
    selector = {
      app = "fotoalbum-auth"
    }

    port {
      port        = 8888
      target_port = 8888
    }

    type = "ClusterIP"
  }
}