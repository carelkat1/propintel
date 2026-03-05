# PropIntel — Deployment Guide

Complete step-by-step instructions to go from zero to production on Vercel.

---

## Prerequisites

- Node.js 20+ installed (`node -v`)
- Git installed (`git --version`)
- A GitHub account (already connected in browser)
- A Vercel account (already connected in browser)
- Vercel CLI: `npm i -g vercel`

---

## Step 1 — Install Dependencies

```bash
cd proptech-app
npm install
```

---

## Step 2 — Run Locally (verify it works)

```bash
npm run dev
```

Open http://localhost:3000 — you should see the Property Intelligence dashboard.

---

## Step 3 — Initialise Git & Push to GitHub

```bash
# Inside the proptech-app directory:
git init
git add .
git commit -m "feat: initial PropIntel application"

# Create a new repo on GitHub (replace YOUR_USERNAME):
gh repo create propintel --public --source=. --remote=origin --push
# — OR — if you don't have gh CLI, do it manually:
# 1. Go to https://github.com/new
# 2. Create repo named "propintel"
# 3. Copy the remote URL, then:
git remote add origin https://github.com/YOUR_USERNAME/propintel.git
git branch -M main
git push -u origin main
```

---

## Step 4 — Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
vercel login          # Opens browser to authenticate
vercel                # Deploys to a preview URL
vercel --prod         # Promotes to production
```

Follow the prompts:
- Set up and deploy: **Y**
- Which scope: select your account
- Link to existing project? **N** → creates new
- Project name: `propintel`
- Directory: `.` (current)
- Override settings? **N**

### Option B — Vercel Dashboard (GitHub integration)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `propintel` repo
4. Framework Preset will auto-detect **Next.js** ✓
5. Click **Deploy**

Vercel will build and deploy in ~60 seconds.

---

## Step 5 — Set Environment Variables (production Lightstone API)

Once deployed, go to:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add:
| Key | Value |
|-----|-------|
| `LIGHTSTONE_API_KEY` | `your_real_api_key` |
| `LIGHTSTONE_API_URL` | `https://api.lightstone.co.za/v1` |

Then redeploy:
```bash
vercel --prod
```

---

## Step 6 — Custom Domain (optional)

In Vercel Dashboard → Settings → Domains → Add `propintel.youragency.co.za`

Update your DNS with the CNAME Vercel provides.

---

## Connecting the Real Lightstone API

Once you have Lightstone API credentials, update `lib/lightstoneService.ts`:

```typescript
// Replace the getLightstoneProperties function with:
export async function getLightstonePropertiesFromAPI(): Promise<Property[]> {
  const res = await fetch(`${process.env.LIGHTSTONE_API_URL}/properties`, {
    headers: {
      Authorization: `Bearer ${process.env.LIGHTSTONE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) throw new Error(`Lightstone API error: ${res.status}`);

  const raw = await res.json();
  // Map Lightstone response shape to our Property type
  return raw.results.map(mapLightstoneProperty);
}
```

---

## Recommended Next Steps (Production Hardening)

1. **Database**: Replace `lib/crmStore.ts` (in-memory) with Supabase/Neon Postgres
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Auth**: Add NextAuth.js for agent login
   ```bash
   npm install next-auth
   ```

3. **Email**: Connect Resend for automated outreach
   ```bash
   npm install resend
   ```

4. **Maps**: Add Mapbox/Google Maps for spatial visualisation

5. **Real-time**: Use Supabase Realtime for live lead updates across agents
