# Vercel Environment Variables Setup

## ⚠️ IMPORTANTE: Configurare queste variabili d'ambiente su Vercel

### 🔴 OBBLIGATORIE

```bash
# Database - MongoDB Atlas (Production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pivabalance-prod

# Authentication & Security
JWT_SECRET=GENERA_UNA_CHIAVE_SICURA_DI_ALMENO_64_CARATTERI
JWT_EXPIRES_IN=7d
SESSION_SECRET=GENERA_UNA_CHIAVE_SICURA_DI_ALMENO_64_CARATTERI
BCRYPT_ROUNDS=12

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production

# Security Settings (Production)
NEXT_PUBLIC_FORCE_HTTPS=true
CSP_ENABLED=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://your-app-name.vercel.app
```

### 🟡 OPZIONALI (se utilizzi questi servizi)

```bash
# Stripe (per donazioni)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (se configurato)
EMAIL_FROM=noreply@your-domain.com
EMAIL_SERVER_HOST=smtp.your-provider.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@your-domain.com
EMAIL_SERVER_PASSWORD=your-email-password

# Analytics (opzionale)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🔧 Come Configurarle su Vercel

1. Vai su https://vercel.com/dashboard
2. Seleziona il tuo progetto
3. Vai su Settings > Environment Variables
4. Aggiungi ogni variabile una per volta
5. Assicurati di selezionare "Production" come environment

## 🚨 CHECKLIST PRE-DEPLOY

- [ ] MongoDB Atlas configurato e accessibile da internet
- [ ] JWT_SECRET generato (usa: `openssl rand -base64 64`)
- [ ] SESSION_SECRET generato (usa: `openssl rand -base64 64`)
- [ ] NEXT_PUBLIC_APP_URL aggiornato con il dominio Vercel
- [ ] CORS_ORIGIN aggiornato con il dominio Vercel
- [ ] Stripe configurato (se utilizzato)
```
