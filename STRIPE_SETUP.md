# 🔑 Configurazione Stripe per Sistema Donazioni

## 📋 **Step-by-Step Setup**

### **1. Ottenere le Chiavi Stripe**

1. **Vai su**: https://dashboard.stripe.com
2. **Registrati/Login** (gratuito)
3. **Assicurati di essere in modalità TEST** (toggle in alto a sinistra)
4. **Vai su**: Developers → API keys
5. **Copia le chiavi**:
   - `pk_test_...` (Publishable key - visibile)
   - `sk_test_...` (Secret key - clicca "Reveal")

### **2. Creare file .env.local**

Crea il file `.env.local` nella root del progetto con:

```env
# Database Configuration (usa la tua connessione MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pivabalance

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-at-least-32-characters-long

# Super Admin Configuration
SUPER_ADMIN_EMAIL=admin@tuodominio.com
SUPER_ADMIN_PASSWORD=SuperSecurePassword123!
SUPER_ADMIN_NAME=Super Admin
ALLOW_INIT_API=true

# 🔑 STRIPE CONFIGURATION - SOSTITUISCI CON LE TUE CHIAVI
STRIPE_SECRET_KEY=sk_test_51ABC...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...
STRIPE_WEBHOOK_SECRET=whsec_123... (OBBLIGATORIO per produzione)

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3001
```

### **3. Riavviare il Server**

Dopo aver aggiunto le chiavi, riavvia il server:

```bash
# Ferma il server corrente (Ctrl+C)
# Poi riavvia:
npm run dev
```

### **4. Carte di Test Stripe**

Usa queste carte per testare:

```
✅ SUCCESSO:
4242424242424242 - Visa
4000056655665556 - Visa (debit)
5555555555554444 - Mastercard

❌ FALLIMENTO:
4000000000000002 - Card declined
4000000000009995 - Insufficient funds
4000000000000069 - Expired card

📋 DATI AGGIUNTIVI:
- Qualsiasi data futura (MM/YY)
- Qualsiasi CVC (3 cifre)
- Qualsiasi nome e indirizzo
```

### **5. Test del Sistema**

1. **Vai su**: http://localhost:3001
2. **Scorri in basso** nel footer
3. **Clicca**: "Supporta il progetto"
4. **Seleziona importo** e compila il form
5. **Usa carta di test**: 4242424242424242
6. **Verifica**: pagamento successful

## 🔒 **Sicurezza**

- ⚠️ **Mai committare** `.env.local`
- ✅ **Solo chiavi TEST** in sviluppo
- 🔄 **Rigenera chiavi** se compromesse
- 🚀 **Chiavi LIVE** solo in produzione

## 🆘 **Troubleshooting**

**Errore "Stripe not configured":**

- Verifica che le chiavi siano nel `.env.local`
- Riavvia il server dopo le modifiche
- Controlla che le chiavi inizino con `pk_test_` e `sk_test_`

**Errore di pagamento:**

- Usa le carte di test ufficiali Stripe
- Verifica di essere in modalità TEST su Stripe
- Controlla la console per errori dettagliati

## 🔗 **Configurazione Webhooks (IMPORTANTE per Produzione)**

### **Step 1: Creare Webhook Endpoint in Stripe**

1. **Vai su**: https://dashboard.stripe.com
2. **Assicurati modalità Test** (per sviluppo)
3. **Vai su**: Developers → Webhooks
4. **Clicca**: "Add endpoint"

### **Step 2: Configurare Endpoint URL**

**Per sviluppo locale (usa ngrok):**

```bash
# Installa ngrok se non lo hai
npm install -g ngrok

# In un terminale separato, esponi il port 3000
ngrok http 3000

# Usa l'URL generato (es: https://abc123.ngrok.io)
```

**Endpoint URL**: `https://your-ngrok-url.ngrok.io/api/donations/webhook`

**Per produzione Vercel:**
**Endpoint URL**: `https://your-app.vercel.app/api/donations/webhook`

### **Step 3: Selezionare Eventi**

Seleziona questi eventi (OBBLIGATORI):

```
✅ payment_intent.succeeded
✅ payment_intent.payment_failed
✅ payment_intent.canceled
```

### **Step 4: Ottenere Webhook Secret**

1. **Clicca** su "Add endpoint"
2. **Clicca** sull'endpoint appena creato
3. **Nella sezione "Signing secret"**, clicca **"Click to reveal"**
4. **Copia** il secret che inizia con `whsec_...`

### **Step 5: Aggiungere alle Variabili d'Ambiente**

**Nel tuo .env.local:**

```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
```

**Su Vercel Dashboard:**

```
STRIPE_WEBHOOK_SECRET = whsec_1234567890abcdef...
```

### **⚠️ IMPORTANTE - Sicurezza Webhooks**

- ✅ **Webhook secret** verifica che le chiamate provengano da Stripe
- ❌ **Senza secret** chiunque può simulare pagamenti falsi
- 🔒 **Mai esporre** il webhook secret nel frontend
- 🔄 **Rigenera** se compromesso

## 📊 **Monitoraggio**

Dopo i test, vai su:

- **Stripe Dashboard** → Payments
- **Vedi le transazioni** di test
- **Analytics** e **Logs** disponibili
- **Webhooks** → Events (per verificare ricezione webhook)
