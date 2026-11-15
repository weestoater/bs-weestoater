# Linux Hosting Deployment – Requirements & Authentication

Status: **planning only**. No deployment workflow is active (see `.github/WORKFLOWS.md`).

The site is a static Vite build (`yarn build` → `dist/`). Deployment = build in GitHub Actions, then copy `dist/` to the web root on the Linux host.

## 1. Recommended authentication

**Key-based SSH with a dedicated, deploy-only key pair, stored as an encrypted GitHub Actions secret.**

Why:

- No password to leak, brute-force or rotate by hand.
- The private key never lives in the repository. It is stored encrypted in GitHub (Settings → Secrets and variables → Actions) and is only exposed to a running workflow, masked in logs.
- The key can be locked down on the server so that, if stolen, it can only upload files to one directory, not open a shell.
- Secrets are not passed to workflows triggered from forks, so a public repo is safe as long as the deploy job only runs on `main` / manual dispatch.

### Hardening (ask the host whether each is possible)

| Measure | Detail |
|---|---|
| Dedicated key | `ssh-keygen -t ed25519 -C "github-deploy-weestoater"` – used for nothing else, no passphrase (CI cannot enter one). |
| Dedicated user | Non-root `deploy` user that owns only the web root. |
| Restricted `authorized_keys` entry | `restrict,from="<GitHub runner IPs, if feasible>",command="rrsync /var/www/weestoater" ssh-ed25519 AAAA...` – forces rsync-only access to one directory, no shell/pty/port-forwarding. (GitHub-hosted runner IPs change; `from=` is often impractical, so omit it unless using a self-hosted runner.) |
| Pinned host key | Store `ssh-keyscan <host>` output as a secret and use strict host-key checking, to prevent man-in-the-middle. |
| GitHub Environment | Create a `production` environment, store the secrets there, restrict it to the `main` branch, optionally require a reviewer. |
| Least-privilege workflow | `permissions: contents: read`; pin third-party actions to a commit SHA. |
| Rotation | Rotate the key annually or on any suspected exposure (add new key, update secret, remove old key). |
| Password auth off | Server `sshd` should have `PasswordAuthentication no` (host's decision). |

### Fallbacks if the host doesn't offer SSH

1. **SFTP with a key** (best fallback – same security as SSH, no shell needed).
2. **FTPS** (explicit TLS) with a dedicated FTP account limited to the web root; password stored as a GitHub secret. Never plain FTP.
3. **Host-provided deploy hook / Git integration** (cPanel "Git Version Control", Plesk Git, etc.) – the host pulls from GitHub; use a read-only deploy key or webhook secret.

### Alternative: pull-based (no inbound credentials)

A self-hosted GitHub runner on the server, or a cron/webhook on the server that downloads the latest build artifact/release. This avoids exposing SSH to GitHub at all, but needs more server setup and maintenance. Only worth it if the host blocks inbound SSH from the internet.

## 2. Information to request from the hosting company

**Access**

- [ ] Is SSH access available (not just FTP)? On this plan?
- [ ] Is `rsync` installed on the server? (Else SFTP/`scp`.)
- [ ] Can I add my own public key to `~/.ssh/authorized_keys`? Can I restrict it with `command=`/`restrict` options?
- [ ] SSH hostname and port (may not be 22).
- [ ] Is password login disabled / can it be?
- [ ] Any IP allow-listing or firewall that would block GitHub Actions runners? Can inbound SSH be limited by IP (and are fixed IPs needed)?
- [ ] Can a separate non-admin user be created for deployments?

**Server layout**

- [ ] Linux distro and web server (nginx / Apache / LiteSpeed).
- [ ] Absolute path of the web root (document root) for the domain.
- [ ] Which user owns the web root and what permissions the web server needs (e.g. files 644 / dirs 755).
- [ ] Can I use a `releases/` + `current` symlink layout (atomic deploy and rollback)? Can the docroot point to a symlink?
- [ ] Is there a post-deploy step needed (cache purge, service reload)? Is a CDN/proxy in front?

**Web server config**

- [ ] Can I set custom response headers? (needed: `index.html` and `sw.js` → `no-cache`; `/assets/*` → `public, max-age=31536000, immutable`; see `netlify.toml`.)
- [ ] For Apache: is `.htaccess` honoured? For nginx: who edits the vhost config?
- [ ] HTTPS: is Let's Encrypt/auto-TLS provided? Is HTTP → HTTPS redirect enabled?
- [ ] Is gzip/brotli compression enabled for JS/CSS/JSON?
- [ ] `/favicon.ico` → `/icon.png` mapping (currently in `public/_redirects`, which is Netlify-specific and ignored on Linux; needs a server rule or a real `favicon.ico`).

**Operational**

- [ ] Backup policy for the web root.
- [ ] Notification/support route if deployment access breaks.

## 3. GitHub-side checklist

Secrets (Environment `production`, **never committed**):

| Secret | Value |
|---|---|
| `DEPLOY_SSH_KEY` | Private key (ed25519) |
| `DEPLOY_KNOWN_HOSTS` | Output of `ssh-keyscan -p <port> <host>` |
| `DEPLOY_HOST` | Hostname |
| `DEPLOY_PORT` | SSH port |
| `DEPLOY_USER` | Deploy username |
| `DEPLOY_PATH` | Absolute web-root path |

Notes:

- Only public build-time values (e.g. a Supabase **anon** key) may be baked into the `dist/` bundle; anything in `VITE_*` is visible to every visitor. Never put service-role keys or deploy credentials in the build.
- The old `deploy.yml.disabled` can be reused for the checkout / Node / `yarn install --frozen-lockfile` / `yarn build` steps; replace the GitHub Pages jobs with an rsync/SFTP step.
- Make `yarn lint` and `yarn test` blocking before deploy (the old workflow continued on test failure).
- Use `concurrency` so only one deployment runs at a time.

## 4. Local one-off setup commands (for reference)

```bash
# Generate the deploy key (no passphrase), keep the private key out of the repo
ssh-keygen -t ed25519 -C "github-deploy-weestoater" -f ~/.ssh/weestoater_deploy -N ""

# Public key → give to host / add to the server's deploy user
cat ~/.ssh/weestoater_deploy.pub

# Private key → paste into the DEPLOY_SSH_KEY GitHub secret, then delete the local copy if not needed
# Host key → DEPLOY_KNOWN_HOSTS secret
ssh-keyscan -p 22 your.host.example
```
