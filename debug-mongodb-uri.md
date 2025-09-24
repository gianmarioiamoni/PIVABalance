# 🔧 MongoDB URI Debug Guide

## Come Ottenere l'URI Corretto da MongoDB Atlas

### Step 1: Accedi a MongoDB Atlas
1. Vai su https://cloud.mongodb.com
2. Login con le tue credenziali
3. Seleziona il tuo progetto

### Step 2: Ottieni Connection String
1. Clicca **"Connect"** sul tuo cluster
2. Seleziona **"Connect your application"**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. **Copia** la connection string

### Step 3: Formato Corretto
```bash
# Esempio da MongoDB Atlas:
mongodb+srv://username:<password>@cluster0.abc123.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

# Sostituisci:
# - username: il tuo username MongoDB
# - <password>: la tua password (rimuovi < >)
# - cluster0.abc123: il nome reale del tuo cluster
# - myFirstDatabase: pivabalance-prod (o il nome che preferisci)
```

### Step 4: Verifica Caratteri Speciali
Se la password contiene caratteri speciali, usa URL encoding:
```bash
# Caratteri da encodare:
@ → %40
: → %3A
/ → %2F
? → %3F
# → %23
[ → %5B
] → %5D
space → %20
```

### Step 5: Database Name
Per production, usa:
```bash
# Alla fine dell'URI, dopo .net/:
/pivabalance-prod
```

### Esempio Completo:
```bash
MONGODB_URI=mongodb+srv://myuser:mypass123@cluster0.abc123.mongodb.net/pivabalance-prod?retryWrites=true&w=majority
```

## Checklist Vercel Environment Variables

- [ ] MONGODB_URI (formato corretto)
- [ ] JWT_SECRET (64+ caratteri)
- [ ] SESSION_SECRET (64+ caratteri)  
- [ ] NODE_ENV=production
- [ ] NEXT_PUBLIC_APP_URL=https://piva-balance.vercel.app

## Test Connection

Dopo aver aggiornato le variabili:
1. Vai su Vercel Dashboard → Deployments
2. Clicca **"Redeploy"**
3. Monitor i logs per errori
4. Test: https://piva-balance.vercel.app/api/health
