#!/usr/bin/env bash
# Idempotent dependency/setup script for the Kalyanamala dev environment.
# Runs after the repositories are checked out. Prepares MongoDB, installs npm
# dependencies for both the frontend and backend, and writes local dev .env
# files (which are gitignored) when they are missing.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPOS_DIR="$(cd "$FRONTEND_DIR/.." && pwd)"

# Locate the backend repo. Cloud Agents check out sibling repos next to the
# frontend (e.g. /agent/repos/kalyanamala-backend), but a single-repo checkout
# can live at /workspace, so probe a few known locations.
BACKEND_DIR=""
for candidate in \
  "$REPOS_DIR/kalyanamala-backend" \
  "/agent/repos/kalyanamala-backend" \
  "$FRONTEND_DIR/../kalyanamala-backend"; do
  if [ -d "$candidate" ]; then
    BACKEND_DIR="$(cd "$candidate" && pwd)"
    break
  fi
done

# 1. Ensure MongoDB Community Server is installed (stable system dependency).
if ! command -v mongod >/dev/null 2>&1; then
  echo "Installing MongoDB Community Server 8.0..."
  sudo apt-get install -y gnupg curl >/dev/null
  curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc \
    | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor --yes
  CODENAME="$( . /etc/os-release && echo "${UBUNTU_CODENAME:-noble}" )"
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${CODENAME}/mongodb-org/8.0 multiverse" \
    | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list >/dev/null
  sudo apt-get update
  sudo apt-get install -y mongodb-org
fi

# 2. Prepare MongoDB data + log directories.
sudo mkdir -p /var/lib/mongodb /var/log/mongodb
sudo chown -R mongodb:mongodb /var/lib/mongodb /var/log/mongodb

# 3. Backend dependencies + local dev env file.
if [ -n "$BACKEND_DIR" ] && [ -d "$BACKEND_DIR" ]; then
  echo "Installing backend dependencies..."
  ( cd "$BACKEND_DIR" && npm install )
  if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo "Writing backend .env with local dev defaults..."
    cat > "$BACKEND_DIR/.env" <<'EOF'
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kalyanamala
JWT_SECRET=dev-local-jwt-secret-change-me
JWT_EXPIRY=30
BCRYPT_ROUNDS=10
EOF
  fi
else
  echo "WARNING: backend repo not found at $BACKEND_DIR (skipping backend setup)."
fi

# 4. Frontend dependencies + local dev env file (points the app at the local API).
echo "Installing frontend dependencies..."
( cd "$FRONTEND_DIR" && npm install )
if [ ! -f "$FRONTEND_DIR/.env" ]; then
  echo "Writing frontend .env with local dev defaults..."
  echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" > "$FRONTEND_DIR/.env"
fi

echo "Install complete."
