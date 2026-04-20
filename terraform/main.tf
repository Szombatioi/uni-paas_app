terraform {
  cloud { #Lab4: in the Terraform cloud instead of local state
    organization = "fotoalbum"

    workspaces {
      name = "fotoalbum-openshift"
    }
  }

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
  }
}

provider "kubernetes" {
  host     = var.openshift_api_url
  token    = var.openshift_token
  insecure = true
}