#!/usr/bin/env bash

# Preload base bash configuration and functions
source bgord-scripts/base.sh

OUT_DIR="build"

info "Environment: staging"
export NODE_ENV="staging"

# ==========================================================

info "Building project!"

# ==========================================================

rm -rf $OUT_DIR
info "Cleaned previous build cache"

# ==========================================================

cp node_modules/@bgord/design/dist/main.min.css static/
cp node_modules/@bgord/design/dist/normalize.min.css static/
info "Copied CSS"

# ==========================================================

npx tsc --strict --esModuleInterop --outDir $OUT_DIR
info "Compiled TypeScript"

# ==========================================================

cp package.json $OUT_DIR
cp package-lock.json $OUT_DIR
cd $OUT_DIR
npm ci --omit=dev --ignore-scripts
cd ../
info "Installed packages"

# ==========================================================

cp -r static $OUT_DIR
info "Copied static files"

# ==========================================================

cp -r .env.staging $OUT_DIR
info "Copied .env.staging"

# ==========================================================

success "Project built correctly!"
