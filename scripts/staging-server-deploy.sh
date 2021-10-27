#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh

info "Environment: staging"

rsync -azP build/ staging:/var/www/resorak
info "Synced source files"

ssh staging "sudo systemctl restart resorak.service"
info "Restarted resorak.service!"

success "Deployed!"
