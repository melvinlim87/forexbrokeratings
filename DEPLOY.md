# Netlify Deploy Instructions

## Status: 🔴 Deploy Blocked — Auth Token Expired

The site builds successfully (`npm run build` passes) and produces static output in `out/`,  
but **production deploy to forexbrokeratings.netlify.app fails** because no valid  
`NETLIFY_AUTH_TOKEN` is set.

### Error
```
Error: Authentication required. NETLIFY_AUTH_TOKEN is not set and `netlify login --request <message>` can be used to authenticate.
```

---

## How to Fix

### Option A: Set a Personal Access Token (Recommended)

1. Go to **https://app.netlify.com/user/applications#personal-access-tokens**
2. Click **"New access token"** → give it a name (e.g. `deploy-cli`)
3. Copy the token
4. Set it as an environment variable:
   ```bash
   export NETLIFY_AUTH_TOKEN=your-token-here
   ```
5. Deploy:
   ```bash
   cd /home/decyphers2/.openclaw/workspace/forexbrokeratings
   npm run build
   npx netlify deploy --prod --dir=out
   ```

### Option B: Interactive Login
```bash
cd /home/decyphers2/.openclaw/workspace/forexbrokeratings
npx netlify login
# Follow the browser prompt to authorize
```

### Option C: Set Token Permanently
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export NETLIFY_AUTH_TOKEN=your-token-here
```

---

## Deploy Command (once authenticated)

```bash
cd /home/decyphers2/.openclaw/workspace/forexbrokeratings
npm run build
npx netlify deploy --prod --dir=out
```

## Site Info
- **URL:** https://forexbrokeratings.netlify.app
- **Build output:** `out/` (static export)
- **Config:** `netlify.toml`
- **Framework:** Next.js (static export)

## Verify Deploy
After deploy, check: https://forexbrokeratings.netlify.app  
Should return 200 (not 404).
