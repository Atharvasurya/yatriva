# Yatriva — Deployment Guide (Phase 1.5)

> **Stack**: Neon (Postgres) · Render (FastAPI backend) · Vercel (Next.js frontend)

---

## 1. Neon — Create the Database

1. Go to [neon.tech](https://neon.tech) → **New Project**
2. Name it `yatriva`, choose region **Asia Pacific (Singapore)** or closest.
3. Open **Connection Details** → copy the **Connection String**:
   ```
   postgresql://yatriva_owner:PASSWORD@ep-XXXX.ap-southeast-1.aws.neon.tech/yatriva?sslmode=require
   ```
   > Always include `?sslmode=require` — Neon rejects plain-text connections.
4. In the Neon dashboard → **SQL Editor**, paste and run `backend/schema.sql`.
5. Keep the connection string handy — paste it into Render next.

---

## 2. Render — Deploy the FastAPI Backend

### Create the service

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo.
3. Settings:

   | Field | Value |
   |---|---|
   | **Root Directory** | `backend` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Plan** | Free |
   | **Health Check Path** | `/health` |

   > Alternatively, push `backend/render.yaml` to the repo root and use
   > **New → Blueprint** — Render reads the file automatically.

### Set environment variables (Render dashboard → Environment)

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon connection string (with `?sslmode=require`) |
| `FRONTEND_URL` | Your Vercel URL, e.g. `https://yatriva.vercel.app` |
| `JWT_SECRET` | Run `python -c "import secrets; print(secrets.token_hex(32))"` |
| `OTP_SMS_PROVIDER` | `demo_mode` (OTP will always be `1234`) |

4. Click **Deploy**. First deploy ~3 min.
5. Verify: `https://yatriva-api.onrender.com/health` → `{"status":"ok",...}`
6. Copy your Render service URL for Vercel.

> **Cold starts**: Render free tier sleeps after 15 min inactivity. First
> request after sleep takes ~20-30 s. Expected behaviour, not a bug.

---

## 3. Vercel — Deploy the Next.js Frontend

### Create the project

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Import your GitHub repo.
3. Settings:

   | Field | Value |
   |---|---|
   | **Framework Preset** | Next.js (auto-detected) |
   | **Root Directory** | `frontend` |

### Set environment variables (Vercel → Settings → Environment Variables)

| Variable | Environment | Value |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Production, Preview, Development | `https://yatriva-api.onrender.com` |

4. Click **Deploy**. Vercel gives you `https://yatriva.vercel.app`.

### Wire CORS back to Render

Back in Render → Environment, set:
```
FRONTEND_URL=https://yatriva.vercel.app
```
Then **Manual Deploy → Deploy latest commit**.

---

## 4. After Any Environment Variable Change

| Platform | How to apply |
|---|---|
| **Render** | Environment → Save → service restarts automatically |
| **Vercel** | Settings → Environment Variables → change → Redeploy |
| **Neon** | Only changes if you rotate the password; update `DATABASE_URL` on Render |

---

## 5. Smoke Tests

```bash
# Backend health
curl https://yatriva-api.onrender.com/health

# CORS pre-flight
curl -H "Origin: https://yatriva.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://yatriva-api.onrender.com/api/chat

# Frontend on phone: open https://yatriva.vercel.app/en
```

---

## Environment Variable Summary

### Render (backend)

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon → Connection Details |
| `FRONTEND_URL` | Vercel → your project URL |
| `JWT_SECRET` | `python -c "import secrets; print(secrets.token_hex(32))"` |
| `OTP_SMS_PROVIDER` | `demo_mode` until SMS provider integrated |

### Vercel (frontend)

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Render → your service URL |

---

## Not Covered Here (Future Phases)

- **Qdrant Cloud** — Phase 4. Currently uses in-memory Qdrant (resets on deploy — fine for now).
- **SMS OTP** — Phase 5. OTP is hard-coded to `1234` in demo mode.
- **Custom domain** — add via Vercel / Render dashboards when ready.
