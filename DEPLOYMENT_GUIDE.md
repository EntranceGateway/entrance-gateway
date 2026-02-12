# CI/CD Deployment Guide

## Overview
This guide explains the complete CI/CD pipeline for deploying the Next.js application to VPS using Docker, GitHub Actions, and Docker Hub.

---

## Architecture

```
GitHub Push → GitHub Actions → Build Docker Image → Push to Docker Hub → Deploy to VPS
```

---

## Prerequisites

### 1. Docker Hub Account
- Create account at https://hub.docker.com
- Create repository: `your-username/entrance-gateway`

### 2. VPS Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Docker and Docker Compose installed
- SSH access configured
- Minimum 2GB RAM, 2 CPU cores

### 3. GitHub Repository Secrets

Go to: `Settings → Secrets and variables → Actions → New repository secret`

Add these secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username | `johndoe` |
| `DOCKERHUB_TOKEN` | Docker Hub access token | `dckr_pat_xxxxx` |
| `VPS_HOST` | VPS IP address or domain | `123.45.67.89` |
| `VPS_USER` | VPS SSH username | `root` or `ubuntu` |
| `VPS_SSH_PORT` | VPS SSH port | `22` |
| `VPS_SSH_KEY` | Private SSH key for VPS | `-----BEGIN RSA PRIVATE KEY-----...` |
| `VPS_DEPLOY_PATH` | Deployment directory on VPS | `/opt/entrance-gateway` |
| `NEXT_PUBLIC_API_URL` | API URL for the application | `https://api.entrancegateway.com` |

---

## Setup Instructions

### Step 1: Generate Docker Hub Access Token

1. Log in to Docker Hub
2. Go to: Account Settings → Security → New Access Token
3. Name: `github-actions`
4. Permissions: Read, Write, Delete
5. Copy the token and save as `DOCKERHUB_TOKEN` secret

### Step 2: Setup VPS SSH Access

On your local machine:

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/vps_deploy_key

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/vps_deploy_key.pub user@your-vps-ip

# Test connection
ssh -i ~/.ssh/vps_deploy_key user@your-vps-ip

# Copy private key content for GitHub secret
cat ~/.ssh/vps_deploy_key
```

Copy the entire private key (including `-----BEGIN` and `-----END` lines) and save as `VPS_SSH_KEY` secret.

### Step 3: Install Docker on VPS

SSH into your VPS and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes to take effect
exit
```

### Step 4: Create Deployment Directory on VPS

```bash
ssh user@your-vps-ip
sudo mkdir -p /opt/entrance-gateway
sudo chown $USER:$USER /opt/entrance-gateway
exit
```

### Step 5: Configure GitHub Secrets

Add all secrets listed in the Prerequisites section to your GitHub repository.

### Step 6: Push to GitHub

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

The pipeline will automatically:
1. Build Docker image
2. Push to Docker Hub
3. Deploy to VPS

---

## Pipeline Workflow

### Build Job
1. Checkout code
2. Setup Docker Buildx
3. Login to Docker Hub
4. Generate semantic image tag (e.g., `prod-abc1234-20240101-120000`)
5. Build multi-stage Docker image with layer caching
6. Push image to Docker Hub

### Deploy Job
1. SSH into VPS
2. Create deployment directory
3. Copy docker-compose.yml
4. Create .env file with secrets
5. Pull latest Docker image
6. Stop old containers
7. Remove dangling volumes
8. Start new containers
9. Health check
10. Cleanup old images (older than 7 days)

---

## Docker Image Tagging Strategy

Images are tagged with semantic versioning:

- **Production (main branch)**: `prod-{short-sha}-{timestamp}`
  - Example: `prod-abc1234-20240101-120000`
  
- **Development (develop branch)**: `dev-{short-sha}-{timestamp}`
  - Example: `dev-xyz5678-20240101-120000`

- **Latest tags**: `main-latest`, `develop-latest`

---

## Environment Variables Management

### Build-time Variables
Set in Dockerfile:
- `NEXT_TELEMETRY_DISABLED=1`
- `NODE_ENV=production`

### Runtime Variables
Set via GitHub Secrets → VPS .env file:
- `NODE_ENV`
- `PORT`
- `NEXT_PUBLIC_API_URL`

### Adding New Environment Variables

1. Add to `.env.example`
2. Add to GitHub Secrets
3. Update `.github/workflows/ci-cd.yml` in "Create .env file on VPS" step
4. Redeploy

---

## Volume Management

### Automatic Cleanup
The pipeline automatically:
- Removes dangling volumes after deployment
- Prunes unused images older than 7 days
- Removes stopped containers

### Manual Cleanup (if needed)

SSH into VPS:

```bash
# List all volumes
docker volume ls

# Remove specific volume
docker volume rm volume_name

# Remove all unused volumes
docker volume prune -f

# Remove all unused images
docker image prune -af

# Complete system cleanup
docker system prune -af --volumes
```

---

## Monitoring and Troubleshooting

### Check Application Status

```bash
ssh user@your-vps-ip
cd /opt/entrance-gateway

# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100

# Check specific service logs
docker-compose logs app
```

### Health Check Endpoint

```bash
curl http://your-vps-ip:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### Common Issues

#### 1. Container won't start
```bash
# Check logs
docker-compose logs app

# Check if port is in use
sudo netstat -tulpn | grep 3000

# Restart container
docker-compose restart app
```

#### 2. Out of disk space
```bash
# Check disk usage
df -h

# Clean Docker resources
docker system prune -af --volumes

# Check Docker disk usage
docker system df
```

#### 3. Image pull fails
```bash
# Login to Docker Hub on VPS
docker login

# Manually pull image
docker pull your-username/entrance-gateway:tag
```

---

## Rollback Procedure

### Option 1: Rollback to Previous Image

```bash
ssh user@your-vps-ip
cd /opt/entrance-gateway

# List available images
docker images | grep entrance-gateway

# Update .env with previous tag
nano .env
# Change IMAGE_TAG to previous version

# Restart with previous image
docker-compose down
docker-compose up -d
```

### Option 2: Rollback via GitHub

1. Find the previous successful commit
2. Revert or create new commit
3. Push to trigger new deployment

---

## Security Best Practices

1. ✅ Use non-root user in Docker container
2. ✅ Use SSH keys (not passwords) for VPS access
3. ✅ Store secrets in GitHub Secrets (not in code)
4. ✅ Use Docker Hub access tokens (not password)
5. ✅ Limit SSH key permissions (chmod 600)
6. ✅ Use Alpine-based images (smaller attack surface)
7. ✅ Regular security updates on VPS

---

## Performance Optimization

### Docker Build Optimization
- ✅ Multi-stage builds (reduces image size by ~70%)
- ✅ Layer caching (faster builds)
- ✅ npm ci instead of npm install (reproducible builds)
- ✅ Alpine base image (smaller size)
- ✅ Standalone Next.js output (optimized runtime)

### Resource Limits
Configured in docker-compose.yml:
- CPU: 0.5-1.0 cores
- Memory: 256MB-512MB

Adjust based on your VPS capacity.

---

## Maintenance

### Weekly Tasks
- Check application logs
- Monitor disk usage
- Review Docker resource usage

### Monthly Tasks
- Update base images
- Review and update dependencies
- Check for security updates

### Commands

```bash
# Update application
git pull origin main  # Triggers auto-deployment

# Manual deployment
ssh user@your-vps-ip
cd /opt/entrance-gateway
docker-compose pull
docker-compose up -d

# Backup (if needed)
docker-compose exec app tar -czf /tmp/backup.tar.gz /app/data
```

---

## Cost Optimization

### Docker Hub
- Free tier: Unlimited public repositories
- Rate limits: 200 pulls/6 hours (authenticated)

### VPS Recommendations
- Minimum: 2GB RAM, 2 CPU, 20GB SSD (~$5-10/month)
- Recommended: 4GB RAM, 2 CPU, 40GB SSD (~$10-20/month)

Providers: DigitalOcean, Linode, Vultr, Hetzner

---

## Support

### Logs Location
- GitHub Actions: Repository → Actions → Workflow run
- VPS: `/opt/entrance-gateway/` + `docker-compose logs`

### Useful Commands

```bash
# View GitHub Actions logs
# Go to: https://github.com/your-username/your-repo/actions

# SSH into VPS
ssh -i ~/.ssh/vps_deploy_key user@your-vps-ip

# Check deployment
cd /opt/entrance-gateway && docker-compose ps

# View real-time logs
docker-compose logs -f --tail=100

# Restart application
docker-compose restart

# Full redeployment
docker-compose down && docker-compose up -d
```

---

## Summary

This CI/CD pipeline provides:
- ✅ Automated builds on every push
- ✅ Optimized Docker images with layer caching
- ✅ Semantic versioning for images
- ✅ Automated deployment to VPS
- ✅ Health checks and monitoring
- ✅ Automatic cleanup of old resources
- ✅ Secure secret management
- ✅ Easy rollback capability

**Total deployment time**: ~3-5 minutes from push to live
