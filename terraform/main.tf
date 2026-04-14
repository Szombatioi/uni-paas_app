terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
  }

  # State tárolás GitHub Actions artifactként
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "kubernetes" {
  host  = var.openshift_api_url
  token = var.openshift_token
  insecure = true
}