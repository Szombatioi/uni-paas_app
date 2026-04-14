resource "kubernetes_persistent_volume_claim" "postgres_pvc" {
  metadata {
    name      = "fotoalbum-db"
    namespace = var.namespace
  }

  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "kubernetes_deployment" "postgres" {
  metadata {
    name      = "fotoalbum-db"
    namespace = var.namespace
    labels = {
      name = "fotoalbum-db"
    }
  }

  wait_for_rollout = false

  spec {
    replicas = 1

    selector {
      match_labels = {
        name = "fotoalbum-db"
      }
    }

    strategy {
      type = "Recreate"
    }

    template {
      metadata {
        labels = {
          name = "fotoalbum-db"
        }
      }

      spec {
        container {
          name  = "postgresql"
          image = "registry.redhat.io/rhel9/postgresql-15:latest"

          env {
            name = "POSTGRESQL_USER"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "DB_USERNAME"
              }
            }
          }

          env {
            name = "POSTGRESQL_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.fotoalbum_secrets.metadata[0].name
                key  = "DB_PASSWORD"
              }
            }
          }

          env {
            name = "POSTGRESQL_DATABASE"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.fotoalbum_config.metadata[0].name
                key  = "DB_NAME"
              }
            }
          }

          port {
            container_port = 5432
          }

          volume_mount {
            name       = "fotoalbum-db-data"
            mount_path = "/var/lib/pgsql/data"
          }

          resources {
            requests = {
              memory = "256Mi"
              cpu    = "250m"
            }
            limits = {
              memory = "512Mi"
              cpu    = "500m"
            }
          }

          liveness_probe {
            exec {
              command = ["/usr/libexec/check-container", "--live"]
            }
            initial_delay_seconds = 120
            period_seconds        = 10
            timeout_seconds       = 10
            failure_threshold     = 3
            success_threshold     = 1
          }

          readiness_probe {
            exec {
              command = ["/usr/libexec/check-container"]
            }
            initial_delay_seconds = 5
            period_seconds        = 10
            timeout_seconds       = 1
            failure_threshold     = 3
            success_threshold     = 1
          }
        }

        volume {
          name = "fotoalbum-db-data"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.postgres_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "postgres" {
  metadata {
    name      = "fotoalbum-db"
    namespace = var.namespace
  }

  spec {
    selector = {
      name = "fotoalbum-db"
    }

    port {
      port        = 5432
      target_port = 5432
    }

    type = "ClusterIP"
  }
}
