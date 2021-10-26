#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh

info "Environment: staging"

rsync -azP --delete build/ staging:/var/www/resorak
info "Synced source files"

success "Deployed!"
