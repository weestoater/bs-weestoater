# Security Checklist

## Credentials Management

### ✅ Implemented

- [x] `.env` file is in `.gitignore` (credentials not committed)
- [x] `.env.example` contains only placeholders
- [x] All secrets removed from git history
- [x] Git history cleaned and force-pushed to GitHub

### ⚠️ ACTION REQUIRED - DO IMMEDIATELY

**CREDENTIALS WERE EXPOSED ON GITHUB** (now cleaned, but original credentials are compromised):

1. **Rotate Strava Credentials:**
   - Go to: https://www.strava.com/settings/api
   - Delete or regenerate your application credentials
   - Copy new Client ID and Client Secret
   - Update your local `.env` with new values
   - Test locally to verify they work

2. **Rotate Garmin Credentials:**
   - Go to: https://www.garmin.com/en-US/account/
   - Change your password
   - Update your local `.env` with new password

3. **Rotate Supabase Credentials:**
   - Go to: https://app.supabase.com/
   - Navigate to your project settings
   - Rotate your Anon Key and Service Role Key
   - Update your local `.env` with new keys

### Prevention Rules Going Forward

**NEVER commit to git:**
- API keys, tokens, or secrets
- Database passwords or connection strings with credentials
- OAuth credentials (client IDs, client secrets)
- Personal authentication tokens
- Private URLs with embedded credentials

**DO:**
- Store secrets in `.env` (gitignored)
- Use placeholders in `.env.example`: `your_api_key_here`
- Add explicit warnings: `# ⚠️ DO NOT COMMIT REAL CREDENTIALS`
- Review commits before pushing: `git diff --cached`
- Use GitHub's built-in secret scanning to detect leaks

**Example `.env` entry:**
```bash
# ⚠️ DO NOT COMMIT THIS FILE
VITE_STRAVA_CLIENT_SECRET=your_actual_secret_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_key_here
```

**Example `.env.example` entry:**
```bash
# Strava OAuth (get from https://www.strava.com/settings/api)
# ⚠️ IMPORTANT: Never commit real credentials to git
VITE_STRAVA_CLIENT_SECRET=your_strava_client_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Verification Commands

Check that no credentials are in git:
```bash
# Search git history for common secret patterns
git log --all -p -S "STRAVA_CLIENT" | head
git log --all -p -S "SERVICE_ROLE" | head

# Verify .env is not tracked
git ls-files | grep "\.env$" || echo "✅ .env not in git"

# Verify .gitignore includes .env
grep "\.env" .gitignore && echo "✅ .env is gitignored"
```

## References

- [GitHub: Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Strava API Docs](https://developers.strava.com/docs/authentication/)
- [Supabase Security](https://supabase.com/docs/guides/security)
