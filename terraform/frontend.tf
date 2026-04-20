resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "fotoalbum-frontend"
    namespace = var.namespace
    labels = {
      app = "fotoalbum-frontend"
    }
  }

  wait_for_rollout = false
  
  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "fotoalbum-frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "fotoalbum-frontend"
        }
      }

      spec {
        container {
          name  = "fotoalbum-frontend"
          image = var.frontend_image

          port {
            container_port = 3000
          }

          env {
            name  = "PORT"
            value = "3000"
          }

          env {
            name = "NEXT_PUBLIC_BACKEND_URL"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "NEXT_PUBLIC_BACKEND_URL"
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

resource "kubernetes_service" "frontend" {
  metadata {
    name      = "fotoalbum-frontend"
    namespace = var.namespace
  }

  spec {
    selector = {
      app = "fotoalbum-frontend"
    }

    port {
      port        = 3000
      target_port = 3000
    }

    type = "ClusterIP"
  }
}