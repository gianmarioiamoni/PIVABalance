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
STRIPE_WEBHOOK_SECRET=whsec_123... (opzionale per ora)

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

## 📊 **Monitoraggio**

Dopo i test, vai su:

- **Stripe Dashboard** → Payments
- **Vedi le transazioni** di test
- **Analytics** e **Logs** disponibili
