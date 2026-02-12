# CI/CD Setup Checklist

Use this checklist to ensure everything is configured correctly.

## ☐ 1. Docker Hub Setup

- [ ] Create Docker Hub account at https://hub.docker.com
- [ ] Create repository: `your-username/entrance-gateway`
- [ ] Generate access token (Account Settings → Security → New Access Token)
- [ ] Save token securely

## ☐ 2. VPS Setup

- [ ] VPS is running (Ubuntu 20.04+ recommended)
- [ ] You have SSH access
- [ ] Docker is installed (`docker --version`)
- [ ] Docker Compose is installed (`docker-compose --version`)
- [ ] Deployment directory created: `/opt/entrance-gateway`
- [ ] User has Docker permissions (`docker ps` works without sudo)

## ☐ 3. SSH Key Setup

- [ ] SSH key pair generated
- [ ] Public key added to VPS (`~/.ssh/authorized_keys`)
- [ ] Private key saved securely
- [ ] SSH connection tested successfully

## ☐ 4. GitHub Secrets Configuration

Go to: `Repository → Settings → Secrets and variables → Actions`

- [ ] `DOCKERHUB_USERNAME` - Your Docker Hub username
- [ ] `DOCKERHUB_TOKEN` - Docker Hub access token
- [ ] `VPS_HOST` - VPS IP address or domain
- [ ] `VPS_USER` - VPS SSH username
- [ ] `VPS_SSH_PORT` - VPS SSH port (usually 22)
- [ ] `VPS_SSH_KEY` - Complete private SSH key
- [ ] `VPS_DEPLOY_PATH` - Deployment path (e.g., `/opt/entrance-gateway`)
- [ ] `NEXT_PUBLIC_API_URL` - API URL (e.g., `https://api.entrancegateway.com`)

## ☐ 5. Repository Files

- [ ] `Dockerfile` exists and configured
- [ ] `docker-compose.yml` exists
- [ ] `.github/workflows/ci-cd.yml` exists
- [ ] `.dockerignore` exists
- [ ] `.env.example` exists
- [ ] `app/api/health/route.ts` exists (health check endpoint)
- [ ] `next.config.ts` has `output: 'standalone'`

## ☐ 6. Test Deployment

- [ ] Push code to `main` or `develop` branch
- [ ] GitHub Actions workflow starts automatically
- [ ] Build job completes successfully
- [ ] Deploy job completes successfully
- [ ] Application is accessible on VPS
- [ ] Health check endpoint works: `http://your-vps-ip:3000/api/health`

## ☐ 7. Verification Commands

Run these on your VPS to verify:

```bash
# Check containers are running
docker ps

# Check application logs
cd /opt/entrance-gateway && docker-compose logs --tail=50

# Test health endpoint
curl http://localhost:3000/api/health

# Check disk usage
docker system df
```

## ☐ 8. Post-Deployment

- [ ] Application loads correctly in browser
- [ ] All features work as expected
- [ ] Environment variables are correct
- [ ] Logs show no errors
- [ ] Health check returns 200 OK

---

## Quick Test Commands

### Test Docker Hub Login
```bash
docker login -u YOUR_USERNAME
```

### Test VPS SSH Connection
```bash
ssh -i ~/.ssh/vps_deploy_key -p 22 user@your-vps-ip "echo 'Connection successful'"
```

### Test Docker on VPS
```bash
ssh -i ~/.ssh/vps_deploy_key -p 22 user@your-vps-ip "docker --version && docker-compose --version"
```

### Trigger Manual Deployment
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## Troubleshooting

### If build fails:
1. Check GitHub Actions logs
2. Verify Dockerfile syntax
3. Ensure all dependencies are in package.json

### If deployment fails:
1. Check VPS SSH connection
2. Verify all GitHub secrets are set correctly
3. Check VPS has enough disk space: `df -h`
4. Check Docker is running: `docker ps`

### If application doesn't start:
1. Check logs: `docker-compose logs`
2. Verify environment variables in `.env`
3. Check port 3000 is not in use: `sudo netstat -tulpn | grep 3000`

---

## Success Criteria

✅ GitHub Actions workflow completes without errors
✅ Docker image is pushed to Docker Hub
✅ Application is running on VPS
✅ Health endpoint returns: `{"status":"healthy"}`
✅ Application is accessible via browser
✅ No errors in application logs

---

## Next Steps After Successful Deployment

1. Setup domain name (if not using IP)
2. Configure Nginx reverse proxy (optional)
3. Setup SSL certificate with Let's Encrypt
4. Configure monitoring and alerts
5. Setup automated backups
6. Document any custom configurations

---

## Support Resources

- **Dockerfile reference**: https://docs.docker.com/engine/reference/builder/
- **Docker Compose**: https://docs.docker.com/compose/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Next.js deployment**: https://nextjs.org/docs/deployment

---

**Estimated Setup Time**: 30-45 minutes

**Deployment Time**: 3-5 minutes per deployment
