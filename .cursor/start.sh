#!/usr/bin/env bash
# Per-boot startup: ensure the local MongoDB instance is running and ready.
# The frontend and backend servers themselves are launched by the `terminals`
# entries in environment.json so their logs remain visible.
set -euo pipefail

sudo mkdir -p /var/lib/mongodb /var/log/mongodb
sudo chown -R mongodb:mongodb /var/lib/mongodb /var/log/mongodb

ping_mongo() {
  mongosh --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1
}

if ping_mongo; then
  echo "MongoDB already running."
  exit 0
fi

echo "Starting mongod..."
sudo -u mongodb mongod \
  --dbpath /var/lib/mongodb \
  --logpath /var/log/mongodb/mongod.log \
  --bind_ip 127.0.0.1 \
  --port 27017 \
  --fork

for _ in $(seq 1 30); do
  if ping_mongo; then
    echo "MongoDB is ready."
    exit 0
  fi
  sleep 1
done

echo "MongoDB did not become ready in time." >&2
exit 1
