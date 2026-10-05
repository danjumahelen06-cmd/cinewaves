# CineWave — Vercel Deployment Guide

This project is fully configured for zero-configuration, production-grade deployment on **Vercel**.

---

## 1. Automated Configuration Included

A `vercel.json` file has been added to the root directory:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures:
- Automatic Vite framework detection
- Production builds to the `dist` output directory
- Full client-side SPA routing (clean refreshes on any route without 404 errors)

---

## 2. Deploy via GitHub & Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial CineWave streaming app commit"
   git branch -M main
   git remote add origin https://github.com/your-username/cinewave.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** → **"Project"**.
   - Select your `cinewave` repository and click **"Import"**.

3. **Configure Project Settings**:
   - **Framework Preset**: Vite *(auto-detected)*
   - **Root Directory**: `./` *(default)*
   - **Build Command**: `npm run build` *(auto-detected)*
   - **Output Directory**: `dist` *(auto-detected)*

4. **Add Environment Variables** (Optional for Supabase Cloud integration):
   Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-public-key`

   *(Note: If you haven't set up your Supabase project yet, you can leave these blank or omit them; CineWave will seamlessly use its built-in interactive sandbox storage mode).*

5. **Click "Deploy"**:
   - Vercel will install dependencies, build the assets, and provide you with a live URL (e.g., `https://cinewave.vercel.app`).

---

## 3. Deploy via Vercel CLI

If you prefer deploying directly from your terminal:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   # Preview deployment:
   vercel

   # Production deployment:
   vercel --prod
   ```

---

## 4. Connecting Your Supabase Database

If you wish to link your cloud Supabase database:
1. In your [Supabase Dashboard](https://app.supabase.com), open the **SQL Editor**.
2. Run the script located in `supabase/schema.sql` (also available directly inside the app under the *Supabase Schema & Setup* menu).
3. Copy your project URL and public anon key from **Project Settings → API**.
4. In your Vercel Project Dashboard: go to **Settings → Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then trigger a redeploy.
