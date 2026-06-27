# E-Com — Production-Grade DevSecOps Platform

A multi-service e-commerce platform built to demonstrate end-to-end DevSecOps practices. Containerised microservices deployed to Kubernetes with full observability, security scanning, and Helm-based packaging.

This is a portfolio project showcasing cloud engineering, DevOps, and platform engineering skills for the UK job market.

## Architecture

Browser

↓

Frontend (React + TypeScript + Vite + nginx)

↓

Catalog Service (FastAPI)  ←→  Order Service (FastAPI)

↓                    ↓

PostgreSQL (catalog and orders databases)

Three microservices communicate over HTTP. Each service owns its own database. All services run as containers orchestrated by Kubernetes.

## Tech Stack

**Application**
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Python 3.12, FastAPI, SQLAlchemy, Alembic
- Database: PostgreSQL 16

**Infrastructure**
- Containerisation: Docker with multi-stage builds and non-root users
- Local Kubernetes: Kind (3-node cluster)
- Package Management: Helm 3
- Observability: Prometheus, Grafana, Alertmanager (kube-prometheus-stack)
- Ingress: NGINX Ingress Controller

**DevSecOps**
- Secret scanning: Gitleaks
- Container scanning: Trivy
- Dockerfile linting: Hadolint
- Shell linting: Shellcheck
- YAML linting: Yamllint
- Pre-commit hooks for all scanners
- GitHub branch protection and signed commits
- Dependabot for dependency updates

## Project Structure
e-com/

├── app/                  Application code

│   ├── backend/

│   │   ├── catalog-service/   FastAPI products API

│   │   └── order-service/     FastAPI orders API

│   ├── frontend/             React TypeScript SPA

│   ├── database/

│   │   └── postgres-init/    Database initialisation

│   └── docker-compose.yaml   Local development orchestration

├── k8s/

│   ├── base/                 Raw Kubernetes manifests

│   │   ├── postgres/         StatefulSet, PVC, Secret, ConfigMap

│   │   ├── catalog-service/  Deployment, Service, ConfigMap, Secret

│   │   ├── order-service/    Deployment, Service, ConfigMap, Secret

│   │   └── frontend/         Deployment, Service, Ingress

│   └── kind-config.yaml      Local cluster configuration

├── helm/

│   ├── catalog-service/      Helm chart per service

│   ├── order-service/

│   ├── ecom/                 Combined application chart

│   └── monitoring/           kube-prometheus-stack values

├── docs/                     Documentation and threat model

├── scripts/                  Helper scripts

└── .pre-commit-config.yaml   Security and linting hooks

## Running Locally

**Prerequisites**

- Docker Desktop with WSL2 integration
- kubectl
- Kind
- Helm

**Option 1 — Docker Compose**

```bash
cd app
docker compose up -d
```

Access at http://localhost:8080

**Option 2 — Kubernetes**

```bash
kind create cluster --name e-com --config k8s/kind-config.yaml
kubectl create namespace ecom
kubectl apply -f k8s/base/postgres/
kubectl apply -f k8s/base/catalog-service/
kubectl apply -f k8s/base/order-service/
kubectl apply -f k8s/base/frontend/
```

Port-forward to access:

```bash
kubectl port-forward -n ecom service/frontend 8080:80
kubectl port-forward -n ecom service/catalog-service 8001:8001
kubectl port-forward -n ecom service/order-service 8002:8002
```

## Project Phases
Phase 1 — Secure Foundation                    Complete

Phase 2 — Local Kubernetes Cluster             Complete

Phase 3 — Observability with Prometheus        Complete

Phase 4 — Helm Charts                          Complete

Phase 4.5 — Real Application Deployment        Complete

Phase 5 — GitOps with ArgoCD                   Planned

Phase 6 — AWS EKS with Terraform               Planned

Phase 7 — CI/CD Pipeline with GitHub Actions   Planned

Phase 8 — Security Hardening                   Planned

## DevSecOps Practices Demonstrated

- Shift-left security with pre-commit hooks blocking secrets, vulnerable Dockerfiles, and broken YAML before they reach the repository
- Signed Git commits with ed25519 keys for cryptographic authorship verification
- GitHub branch protection requiring pull requests for any changes to main
- Multi-stage Docker builds producing minimal images without build tooling
- Non-root container users for defence in depth
- Kubernetes ConfigMaps for non-secret configuration and Secrets for sensitive data
- Liveness and readiness probes for self-healing and traffic management
- Resource requests and limits to prevent noisy neighbour problems
- StatefulSets with PersistentVolumeClaims for stateful database workloads
- Service-to-service communication through Kubernetes internal DNS
- Full observability stack monitoring application and infrastructure health
- Conventional Commits for automated changelog generation
- Architecture decision records for technical traceability

## Skills Demonstrated

Cloud and DevOps: Docker, Kubernetes, Helm, Kind, kubectl, Ingress controllers
Languages: Python, TypeScript, Bash, YAML
Databases: PostgreSQL, SQLAlchemy ORM, Alembic migrations
Security: Gitleaks, Trivy, Hadolint, signed commits, branch protection
Observability: Prometheus, Grafana, Alertmanager, PromQL
Source Control: Git, GitHub, Conventional Commits, pre-commit hooks
Infrastructure as Code: Helm templates, Kubernetes manifests, Terraform (planned)
CI/CD: GitHub Actions (planned)
