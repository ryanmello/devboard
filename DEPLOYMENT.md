# Deploying the Devboard Go Backend on AWS EC2

A step-by-step guide to deploying the Devboard Go API (Gin framework) to an AWS EC2 instance. You'll compile a Go binary on your local machine, upload it to a Linux server, and set it up to run permanently with HTTPS.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Build the Go Binary](#3-build-the-go-binary)
4. [Launch an EC2 Instance](#4-launch-an-ec2-instance)
5. [Connect to Your Instance](#5-connect-to-your-instance)
6. [Upload and Configure](#6-upload-and-configure)
7. [Test the Server](#7-test-the-server)
8. [Set Up as a Systemd Service](#8-set-up-as-a-systemd-service)
9. [Set Up Nginx and HTTPS](#9-set-up-nginx-and-https)
10. [Assign an Elastic IP and Domain](#10-assign-an-elastic-ip-and-domain)
11. [Deploying Updates](#11-deploying-updates)
12. [Post-Deployment Checklist](#12-post-deployment-checklist)
13. [Ongoing Maintenance](#13-ongoing-maintenance)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Architecture Overview

```
                         ┌─────────────┐
  Users / Next.js UI ──> │   AWS EC2   │ ──> Supabase PostgreSQL
                         │  (Go API)   │ ──> GitHub API
                         └─────────────┘     LeetCode API
```

**What you're deploying:**

- A Go binary built from `main.go` using the Gin web framework
- Listens on a configurable `PORT` (default 8080)
- Connects to Supabase PostgreSQL (external — not hosted on AWS)
- Fetches Supabase JWKS for JWT verification
- Calls GitHub and LeetCode APIs
- Exposes `/health` for health checks and `/swagger/*` for API docs

**What stays external (not on AWS):**

- Supabase (database + auth) — already hosted by Supabase
- Your Next.js frontend — deployed separately (e.g. Vercel)

---

## 2. Prerequisites

### 2.1 Create an AWS Account

1. Go to https://aws.amazon.com and click **Create an AWS Account**
2. Enter email, set a root password, and provide billing info
3. Choose the **Free Tier** — EC2 `t2.micro` is free for 12 months (750 hrs/month)

### 2.2 Install the AWS CLI

**Windows:**

1. Download the installer: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Run the `.msi` file and click through the wizard (all defaults are fine)
3. **Close and reopen your terminal**, then verify:

```powershell
aws --version
# Should print: aws-cli/2.x.x Python/3.x.x Windows/10 ...
```

<details>
<summary>macOS / Linux install instructions</summary>

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

</details>

**Then configure it (all platforms):**

```bash
aws configure
```

It will prompt you for four values:
- **AWS Access Key ID**: (from IAM, see below)
- **AWS Secret Access Key**: (from IAM, see below)
- **Default region**: `us-east-1`
- **Default output format**: `json`

To create access keys: **AWS Console > IAM > Users > Your User > Security Credentials > Create Access Key**

### 2.3 Install Go (for Building Locally)

Make sure you have Go 1.24+ installed: https://go.dev/dl/

### 2.4 Gather Your Environment Variables

You'll need these values ready (from your `.env` file):

| Variable           | Description                          | Example                                              |
| ------------------ | ------------------------------------ | ---------------------------------------------------- |
| `PORT`             | Port the server listens on           | `8080`                                               |
| `GIN_MODE`         | Gin run mode                         | `release` (always use `release` in production)       |
| `SUPABASE_URL`     | Your Supabase project URL            | `https://abc123.supabase.co`                         |
| `SUPABASE_DB_URL`  | PostgreSQL connection string         | `postgresql://postgres:pw@db.abc123.supabase.co:5432/postgres` |
| `GITHUB_TOKEN`     | GitHub personal access token         | `ghp_xxxx`                                           |
| `ALLOWED_ORIGINS`  | CORS allowed origins (your frontend) | `https://devboard.io`                                |

---

## 3. Build the Go Binary

Go compiles to a single static binary — no runtime, no dependencies needed on the server. You build it on your local machine targeting Linux (since EC2 runs Linux):

```bash
# From the project root (where main.go is)

# Windows (PowerShell):
$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build -o devboard-api .

# macOS / Linux:
GOOS=linux GOARCH=amd64 go build -o devboard-api .
```

This produces a single file called `devboard-api` (~15-25 MB). That's your entire backend — ready to run on any Linux machine.

---

## 4. Launch an EC2 Instance

1. Go to **AWS Console > EC2 > Launch Instance**
2. Configure the following:

| Setting             | Value                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| **Name**            | `devboard-api`                                                        |
| **AMI**             | Amazon Linux 2023 (free tier eligible)                                |
| **Instance type**   | `t2.micro` (free tier) or `t3.micro`                                  |
| **Key pair**        | Create new — name it `devboard-key`, type RSA, format `.pem`, download it |
| **Storage**         | 8 GB gp3 (default is fine)                                           |

3. Under **Network settings**, click **Edit** and configure:
   - **Allow SSH traffic** (port 22) — set source to **My IP** for security
   - **Allow HTTP traffic** (port 80)
   - **Allow HTTPS traffic** (port 443)
   - Click **Add security group rule**: Custom TCP, port **8080**, source `0.0.0.0/0`

4. Click **Launch Instance**

Save the `.pem` key file somewhere safe — you'll need it for every SSH connection.

---

## 5. Connect to Your Instance

Find your instance's **Public IPv4 address** in the EC2 dashboard (EC2 > Instances > click your instance).

### First-Time Key Setup

```bash
# Windows (PowerShell) — move key and set it up:
mkdir -Force $env:USERPROFILE\.ssh
Move-Item devboard-key.pem $env:USERPROFILE\.ssh\devboard-key.pem

# macOS / Linux — set permissions:
chmod 400 ~/.ssh/devboard-key.pem
```

### SSH In

```bash
ssh -i ~/.ssh/devboard-key.pem ec2-user@<YOUR_PUBLIC_IP>
```

You should see a terminal prompt like `[ec2-user@ip-172-xx-xx-xx ~]$`. You're now on your EC2 server.

---

## 6. Upload and Configure

### 6.1 Upload the Binary

Open a **new local terminal** (not the SSH session) and run:

```bash
scp -i ~/.ssh/devboard-key.pem devboard-api ec2-user@<YOUR_PUBLIC_IP>:~/devboard-api
```

### 6.2 Create the Environment File

Back in the **SSH session** on EC2:

```bash
cat > ~/devboard.env << 'EOF'
PORT=8080
GIN_MODE=release
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_DB_URL=postgresql://postgres:yourpassword@db.your-project.supabase.co:5432/postgres
GITHUB_TOKEN=ghp_your_token_here
ALLOWED_ORIGINS=https://your-frontend-domain.com
EOF

# Lock down permissions — this file contains secrets
chmod 600 ~/devboard.env
```

Replace the placeholder values with your real credentials.

### 6.3 Make the Binary Executable

```bash
chmod +x ~/devboard-api
```

---

## 7. Test the Server

Still on EC2 via SSH:

```bash
# Load env vars and start the server
set -a && source ~/devboard.env && set +a
./devboard-api
```

You should see output like:

```
Database connection established
Database migration completed
Supabase JWKS public key loaded
Server starting on port 8080
```

Open a browser and go to `http://<YOUR_PUBLIC_IP>:8080/health`. You should see:

```json
{"status":"ok"}
```

Press `Ctrl+C` to stop the server once you've confirmed it works.

---

## 8. Set Up as a Systemd Service

Without this, your API stops the moment you close the SSH session or the instance reboots. Systemd keeps it running permanently and auto-restarts it if it crashes.

### Create the Service File

```bash
sudo tee /etc/systemd/system/devboard.service > /dev/null << 'EOF'
[Unit]
Description=Devboard API Server
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user
EnvironmentFile=/home/ec2-user/devboard.env
ExecStart=/home/ec2-user/devboard-api
Restart=always
RestartSec=5

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=devboard-api

[Install]
WantedBy=multi-user.target
EOF
```

### Enable and Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable devboard      # Auto-start on boot
sudo systemctl start devboard       # Start right now
```

### Verify

```bash
# Check it's running
sudo systemctl status devboard

# View live logs
sudo journalctl -u devboard -f

# View recent logs
sudo journalctl -u devboard --since "5 minutes ago"
```

At this point, your API is live at `http://<YOUR_PUBLIC_IP>:8080` and will survive reboots.

---

## 9. Set Up Nginx and HTTPS

Nginx sits in front of your Go server and handles SSL/HTTPS so clients connect securely on port 443 instead of directly hitting port 8080.

### 9.1 Install and Configure Nginx

```bash
sudo dnf install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

Create the Nginx config:

```bash
sudo tee /etc/nginx/conf.d/devboard.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-api-domain.com;    # Replace with your domain

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Test the config and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 9.2 Add HTTPS with Let's Encrypt (Free SSL)

This requires a domain name pointed at your server (see [Step 10](#10-assign-an-elastic-ip-and-domain)).

```bash
# Install Certbot
sudo dnf install certbot python3-certbot-nginx -y

# Get a certificate (replace with your domain)
sudo certbot --nginx -d your-api-domain.com

# Certbot sets up auto-renewal automatically. Verify with:
sudo certbot renew --dry-run
```

After this, your API is available at `https://your-api-domain.com`.

### 9.3 Remove Direct Port 8080 Access (Optional)

Once Nginx + HTTPS is working, you can remove the port 8080 security group rule in the EC2 console so all traffic goes through Nginx on ports 80/443.

---

## 10. Assign an Elastic IP and Domain

### 10.1 Elastic IP (Important)

By default, your EC2 public IP **changes every time the instance reboots**. An Elastic IP gives you a permanent static IP.

1. Go to **EC2 > Elastic IPs > Allocate Elastic IP address**
2. Select the new Elastic IP > **Actions > Associate Elastic IP address**
3. Choose your `devboard-api` instance
4. This IP is now permanent and free while attached to a running instance

### 10.2 Point a Domain

1. Go to your domain registrar (Namecheap, Cloudflare, Route 53, etc.)
2. Add an **A record**:
   - **Name**: `api` (for `api.devboard.io`) or `@` for the root domain
   - **Value**: Your Elastic IP (e.g., `54.123.45.67`)
   - **TTL**: 300 (or Auto)
3. Wait a few minutes for DNS propagation
4. Then run the Certbot command from Step 9.2 using your domain

---

## 11. Deploying Updates

Every time you make changes to the Go backend:

```bash
# 1. Build the new binary (local machine)
# Windows (PowerShell):
$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build -o devboard-api .

# macOS / Linux:
# GOOS=linux GOARCH=amd64 go build -o devboard-api .

# 2. Upload to EC2
scp -i ~/.ssh/devboard-key.pem devboard-api ec2-user@<YOUR_ELASTIC_IP>:~/devboard-api

# 3. Restart the service (SSH into EC2 first)
ssh -i ~/.ssh/devboard-key.pem ec2-user@<YOUR_ELASTIC_IP>
sudo systemctl restart devboard

# 4. Verify it started cleanly
sudo journalctl -u devboard --since "30 seconds ago"
```

The whole process takes about 30 seconds. There will be a few seconds of downtime during the restart.

---

## 12. Post-Deployment Checklist

After deploying, verify everything works:

- [ ] **Health check**: `curl https://your-api-domain.com/health` returns `{"status":"ok"}`
- [ ] **Swagger docs**: Visit `https://your-api-domain.com/swagger/index.html`
- [ ] **Database**: Logs show "Database connection established"
- [ ] **JWKS**: Logs show "Supabase JWKS public key loaded"
- [ ] **Supabase IP allowlist**: Add your EC2 Elastic IP in **Supabase Dashboard > Database > Network**
- [ ] **CORS**: Test from your frontend — requests should not be blocked
- [ ] **Auth flow**: Sign in from the frontend, call `GET /api/v1/users/me`
- [ ] **GitHub integration**: Call `/api/v1/users/<username>/github` and verify data
- [ ] **Update `ALLOWED_ORIGINS`**: Set to your production frontend URL (e.g., `https://devboard.io`)
- [ ] **Update Swagger host**: In `main.go`, change `@host localhost:8080` to your production domain
- [ ] **Update frontend API URL**: In the Next.js UI, point the API URL / proxy to your new backend URL

---

## 13. Ongoing Maintenance

### Viewing Logs

```bash
sudo journalctl -u devboard -f                    # Follow live logs
sudo journalctl -u devboard --since "1 hour ago"  # Recent logs
sudo journalctl -u devboard --since today          # Today's logs
```

### Server Updates

```bash
# Keep the OS patched
sudo dnf update -y

# Reboot if kernel was updated (your service auto-starts after reboot)
sudo reboot
```

### Monitoring

Set up a CloudWatch alarm for basic monitoring:

1. Go to **EC2 > Instances > Your Instance > Monitoring tab**
2. Click **Manage CloudWatch alarms**
3. Create an alarm for CPU utilization > 80% — get notified via email (SNS)

### Estimated Costs

| Resource       | Free Tier                                  | After Free Tier   |
| -------------- | ------------------------------------------ | ----------------- |
| EC2 t2.micro   | 750 hrs/month free for 12 months           | ~$8.50/month      |
| Elastic IP     | Free while attached to a running instance  | $3.60/month if idle |
| Data transfer  | 100 GB/month outbound free                 | $0.09/GB after    |

**For a low-traffic project, expect $0/month for the first year under free tier.**

### Security Reminders

- **Never commit `.env` files** or secrets to git
- Rotate your `GITHUB_TOKEN` periodically
- Keep SSH access restricted to your IP only (update the security group when your IP changes)
- Run `sudo dnf update -y` regularly for security patches
- For production, consider storing secrets in **AWS Systems Manager Parameter Store** instead of a plain env file

---

## 14. Troubleshooting

### "Connection refused" when hitting the API

- Check the service is running: `sudo systemctl status devboard`
- Check the EC2 security group allows inbound traffic on the correct port (8080, or 80/443 with Nginx)
- Check the binary has execute permissions: `chmod +x ~/devboard-api`

### "Failed to connect to database"

- Verify `SUPABASE_DB_URL` is correct in `~/devboard.env`
- Supabase may restrict connections by IP — go to **Supabase Dashboard > Database > Network** and add your EC2 Elastic IP
- Check that the password doesn't contain special characters that need URL encoding (e.g., `@` becomes `%40`)

### "Failed to fetch Supabase JWKS"

- Verify `SUPABASE_URL` is correct (should be `https://xxx.supabase.co`, no trailing slash)
- Ensure outbound HTTPS (port 443) is allowed — EC2 security groups allow all outbound by default, but double-check if you've modified them

### Binary won't run on EC2

- Make sure you cross-compiled for Linux: `GOOS=linux GOARCH=amd64 go build -o devboard-api .`
- If you get "permission denied": `chmod +x ~/devboard-api`
- If you get "cannot execute binary file": you likely built for the wrong OS/architecture

### Service won't start after editing the env file

```bash
# After changing ~/devboard.env, always restart:
sudo systemctl restart devboard

# Check for errors:
sudo journalctl -u devboard --since "1 minute ago"
```

### CORS errors from the frontend

- Set `ALLOWED_ORIGINS` to your exact frontend URL (e.g., `https://devboard.io`)
- Do **not** include a trailing slash
- For multiple origins, update the CORS middleware to split and check against a list

### Nginx returns 502 Bad Gateway

- The Go server probably isn't running: `sudo systemctl status devboard`
- Check if the port in Nginx config matches the `PORT` in your env file
- Review Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

---

## Quick Reference: Commands Cheat Sheet

```bash
# === Build (local machine) ===
$env:GOOS = "linux"                                # PowerShell
$env:GOARCH = "amd64"
go build -o devboard-api .

# === Upload to EC2 ===
scp -i ~/.ssh/devboard-key.pem devboard-api ec2-user@<IP>:~/devboard-api

# === SSH into EC2 ===
ssh -i ~/.ssh/devboard-key.pem ec2-user@<IP>

# === Service Management (on EC2) ===
sudo systemctl start devboard        # Start
sudo systemctl stop devboard         # Stop
sudo systemctl restart devboard      # Restart
sudo systemctl status devboard       # Status

# === Logs (on EC2) ===
sudo journalctl -u devboard -f                    # Live tail
sudo journalctl -u devboard --since "5 min ago"   # Recent

# === Nginx (on EC2) ===
sudo nginx -t                        # Test config
sudo systemctl reload nginx          # Reload config
sudo tail -f /var/log/nginx/error.log
```
