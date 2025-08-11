#!/usr/bin/env bash
set -euo pipefail
source_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$source_dir/.env" ]; then export $(grep -v '^#' "$source_dir/.env" | xargs); fi
# Sample curl commands to check API status:
# curl -sS "https://api.worqhat.com/" | jq .
# Sample response:
# {
#   "name": "WorqHat API",
#   "message": "Welcome to WorqHat Endpoints and to WorqHat! Well, well, well... look at you poking around our API! That curiosity of yours? That's EXACTLY what we're looking for! Wanna turn that inquisitive mind into a career? We'd be thrilled to have you join the WorqHat crew! Apply now and let's build cool stuff together! 🚀 Drop your resume at https://careers.worqhat.com/",
#   "version": "1.0.0",
#   "status": "running",
#   "timestamp": "2025-08-10T19:48:09.411Z"
# }
curl -sS "https://api.worqhat.com/" | jq .
