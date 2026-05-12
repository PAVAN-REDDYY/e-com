#!/bin/bash

echo " Tool check started"

check_tool() {
  if eval "$2" &>/dev/null; then
    echo "  OK   $1 - $(eval "$2" 2>&1 | head -1)"
  else
    echo "  MISSING  $1 - please install this tool"
  fi
}

check_tool "Git"        "git --version"
check_tool "Python3"    "python3 --version"
check_tool "Docker"     "docker --version"
check_tool "kubectl"    "kubectl version --client"
check_tool "Kind"       "kind --version"
check_tool "Helm"       "helm version --short"
check_tool "AWS CLI"    "aws --version"
check_tool "Terraform"  "terraform --version"
check_tool "eksctl"     "eksctl version"
check_tool "Trivy"      "trivy --version"
check_tool "Pre-commit" "pre-commit --version"

echo "Tool check completed"
