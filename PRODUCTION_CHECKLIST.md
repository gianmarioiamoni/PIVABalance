# 🚀 PIVABalance - Production Launch Checklist

## ✅ FASE 1: DONAZIONI SOLO CARTE

### 🔐 **1. STRIPE SETUP LIVE**

#### A. Ottieni chiavi Stripe LIVE:

1. Vai su https://dashboard.stripe.com
2. **Switch da TEST a LIVE** (toggle in alto a sinistra)
3. Vai su **Developers → API keys**
4. Copia le chiavi LIVE:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

#### B. Configura Webhook LIVE:

1. In Stripe Dashboard (LIVE mode) → **Developers → Webhooks**
2. **Add endpoint**: `https://tuodominio.com/api/donations/webhook`
3. **Select events**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copia il **Webhook Secret**:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 🌍 **2. VARIABILI AMBIENTE PRODUZIONE**

Aggiorna `.env.local` o configura nel tuo hosting:

```env
# Database
MONGODB_URI=mongodb+srv://your-cluster.mongodb.net/pivabalance-prod
NEXTAUTH_URL=https://tuodominio.com
NEXTAUTH_SECRET=your-super-secret-key-32-chars-min

# Stripe LIVE Keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (opzionale per Fase 1)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Security
NODE_ENV=production
```

### 🧪 **3. BUILD E TEST**

#### Quick Build (per test rapidi):

```bash
# Build saltando alcuni errori di linting
chmod +x scripts/quick-build.sh
./scripts/quick-build.sh
```

#### Test Checklist:

- [ ] **Build completato** senza errori fatali
- [ ] **Pagina donations si carica** senza errori
- [ ] **Modal si apre** correttamente
- [ ] **Form validation** funziona
- [ ] **Stripe Elements** si carica
- [ ] **Test con carta reale** (€1.00)
- [ ] **Webhook riceve eventi** (check logs)
- [ ] **Database aggiornato** correttamente
- [ ] **Mobile responsive** ok

#### Test Payment Flow:

```bash
# Test con €1 reale
Carta: La tua carta reale
Importo: €1.00
Verifica: Email ricevuta Stripe + DB aggiornato
```

### 🚀 **4. DEPLOYMENT**

#### Opzioni Hosting Consigliate:

**A. Vercel (Raccomandato)**

```bash
# Deploy automatico
git push origin main

# Configura env vars in Vercel dashboard
# Webhook URL: https://your-app.vercel.app/api/donations/webhook
```

**B. Railway**

```bash
railway login
railway link
railway up

# Configura env vars in Railway dashboard
```

**C. Digital Ocean App Platform**

```bash
# Deploy via GitHub integration
# Webhook URL: https://your-app.ondigitalocean.app/api/donations/webhook
```

### 📊 **5. MONITORAGGIO**

#### Setup Logging:

```javascript
// Aggiungi a webhook handler
console.log(`✅ Donation: €${amount} - ${status} - ${timestamp}`);
```

#### Monitoring Tools:

- **Stripe Dashboard**: Pagamenti in tempo reale
- **MongoDB Atlas**: Performance database
- **Vercel Analytics**: Performance app
- **Sentry** (opzionale): Error tracking

### 🔒 **6. SICUREZZA**

- [ ] **HTTPS attivo** (automatico su Vercel/Railway)
- [ ] **Env variables sicure** (non in codice)
- [ ] **Webhook signature verification** (✅ implementato)
- [ ] **CORS configurato** correttamente
- [ ] **Rate limiting** (TODO per Fase 2)

### 📧 **7. COMUNICAZIONE**

#### Email Template Base:

```
Oggetto: Grazie per la tua donazione a PIVABalance!

Ciao [Nome],

Grazie per aver supportato PIVABalance con una donazione di €[Importo]!

Il tuo contributo ci aiuta a:
- Mantenere il servizio gratuito
- Sviluppare nuove funzionalità
- Coprire i costi del server

Ricevuta Stripe: [Link]

Grazie ancora!
Il team PIVABalance
```

### ⚡ **8. GO-LIVE STEPS**

#### Giorno del Lancio:

1. **Deploy finale** con chiavi LIVE
2. **Test €1** reale
3. **Attiva webhook** in Stripe
4. **Monitora primi pagamenti**
5. **Annuncia** agli utenti

#### Post-Launch (Prima settimana):

- Monitora errori quotidianamente
- Verifica webhook funziona
- Check performance database
- Raccogli feedback utenti

---

## 🎯 **ROADMAP FASE 2 (Mese 2-3)**

- [ ] SEPA Direct Debit
- [ ] Email automatiche
- [ ] Dashboard admin donazioni
- [ ] Donazioni ricorrenti
- [ ] Export fiscale

---

## 🆘 **EMERGENCY CONTACTS**

- **Stripe Support**: https://support.stripe.com
- **MongoDB Atlas**: https://support.mongodb.com
- **Vercel Support**: https://vercel.com/help

---

## 📈 **SUCCESS METRICS**

**Settimana 1:**

- [ ] Zero errori critici
- [ ] Almeno 1 donazione test
- [ ] Webhook 100% funzionante

**Mese 1:**

- [ ] 10+ donazioni totali
- [ ] €100+ raccolti
- [ ] 99%+ uptime

**Obiettivo Fase 1:** Sistema stabile, donazioni funzionanti, utenti soddisfatti! 🎉
