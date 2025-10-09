# 📋 PIVABalance - Scripts Documentation

Questa directory contiene script utili per lo sviluppo, deployment e manutenzione dell'applicazione PIVABalance.

## 📑 Indice

- [🔧 Setup e Configurazione](#-setup-e-configurazione)
- [🚀 Deployment e Produzione](#-deployment-e-produzione)
- [🔒 Sicurezza](#-sicurezza)
- [⚡ Performance](#-performance)
- [🧪 Testing e Verifica](#-testing-e-verifica)
- [👤 Amministrazione](#-amministrazione)

---

## 🔧 Setup e Configurazione

### `setup-env.js`

**Comando**: `npm run setup:env`

**Funzionalità**:

- Genera automaticamente file `.env.local` con configurazioni sicure
- Crea JWT secret casuali e sicuri
- Fornisce template per sviluppo e produzione
- Valida configurazioni esistenti

**Utilizzo**:

```bash
npm run setup:env
```

**Quando usarlo**:

- ✅ Setup iniziale progetto
- ✅ Onboarding nuovi sviluppatori
- ✅ Reset configurazione ambiente
- ✅ Validazione variabili esistenti

**Output**:

- Crea `.env.local` con tutte le variabili necessarie
- Genera `.env.production.template` per produzione
- Valida configurazioni esistenti

---

## 🚀 Deployment e Produzione

### `production-readiness.js`

**Comando**: `npm run production:check`

**Funzionalità**:

- Verifica completa della configurazione per produzione
- Controlla variabili d'ambiente obbligatorie
- Valida configurazione build e sicurezza
- Analizza dipendenze per vulnerabilità

**Utilizzo**:

```bash
npm run production:check
```

**Quando usarlo**:

- ✅ Prima di ogni deployment in produzione
- ✅ Audit periodici del progetto
- ✅ Verifica dopo modifiche configurazione
- ✅ CI/CD pipeline checks

**Controlli effettuati**:

- ✅ Variabili d'ambiente richieste
- ✅ Configurazione build Next.js
- ✅ Headers di sicurezza
- ✅ Dipendenze vulnerabili
- ✅ File critici presenti

### `vercel-deploy-check.js`

**Comando**: `npm run vercel:check`

**Funzionalità**:

- Checklist specifica per deployment Vercel
- Genera `vercel.json` ottimizzato
- Verifica struttura progetto
- Controlla configurazione build

**Utilizzo**:

```bash
npm run vercel:check
```

**Quando usarlo**:

- ✅ Prima del primo deployment su Vercel
- ✅ Aggiornamento configurazione Vercel
- ✅ Troubleshooting deployment issues
- ✅ Ottimizzazione configurazione

**Output**:

- Genera `vercel.json` con configurazioni ottimali
- Report dettagliato readiness deployment
- Lista variabili d'ambiente mancanti

---

## 🔒 Sicurezza

### `security-scan.js`

**Comando**: `npm run security:scan`

**Funzionalità**:

- Scansione vulnerabilità dipendenze (npm audit)
- Controllo sicurezza variabili d'ambiente
- Verifica headers di sicurezza
- Analisi pattern di sicurezza nel codice

**Utilizzo**:

```bash
npm run security:scan
```

**Quando usarlo**:

- ✅ Prima di ogni deployment
- ✅ Audit di sicurezza periodici
- ✅ Dopo aggiornamento dipendenze
- ✅ Compliance security checks

**Controlli effettuati**:

- 🔍 Vulnerabilità dipendenze npm
- 🔍 Forza JWT secret
- 🔍 File sensibili in repository
- 🔍 Headers di sicurezza configurati
- 🔍 Utilities di sicurezza implementate

---

## ⚡ Performance

### `performance-monitor.js`

**Comando**: `npm run perf:monitor`

**Funzionalità**:

- Analisi performance build
- Monitoring dimensioni bundle
- Controllo budget performance
- Suggerimenti ottimizzazione

**Utilizzo**:

```bash
npm run perf:monitor
```

**Quando usarlo**:

- ✅ Dopo modifiche significative al codice
- ✅ Prima di deployment produzione
- ✅ Audit performance periodici
- ✅ Troubleshooting performance issues

**Metriche monitorate**:

- 📊 Dimensioni pagine
- 📊 Dimensioni bundle totale
- 📊 Numero chunks
- 📊 Codice non utilizzato
- 📊 Compliance budget performance

### `analyze-bundle.js`

**Comando**: `npm run analyze:bundle`

**Funzionalità**:

- Analisi dettagliata composizione bundle
- Identificazione dipendenze pesanti
- Suggerimenti ottimizzazione specifici
- Rilevamento file grandi

**Utilizzo**:

```bash
npm run analyze:bundle
```

**Quando usarlo**:

- ✅ Ottimizzazione bundle size
- ✅ Identificazione dipendenze inutili
- ✅ Code splitting analysis
- ✅ Performance debugging

**Analisi fornite**:

- 📈 Dipendenze per dimensione
- 📈 Componenti grandi (>10KB)
- 📈 Suggerimenti code splitting
- 📈 Raccomandazioni ottimizzazione

---

## 🧪 Testing e Verifica

### `verify-db-connection.js`

**Comando**: `npm run db:verify`

**Funzionalità**:

- Test connessione MongoDB Atlas
- Verifica credenziali database
- Controllo operazioni base
- Diagnostica problemi connessione

**Utilizzo**:

```bash
npm run db:verify
```

**Quando usarlo**:

- ✅ Setup iniziale database
- ✅ Troubleshooting connessione DB
- ✅ Verifica dopo cambio credenziali
- ✅ Health check database

**Verifiche effettuate**:

- 🔌 Connessione MongoDB
- 🔌 Autenticazione credenziali
- 🔌 Operazioni base (list collections)
- 🔌 Statistiche database

### `test-stripe-config.js`

**Comando**: `npm run stripe:test`

**Funzionalità**:

- Verifica configurazione Stripe completa
- Test connessione API Stripe
- Controllo webhook endpoints
- Validazione formato chiavi

**Utilizzo**:

```bash
npm run stripe:test
```

**Quando usarlo**:

- ✅ Setup sistema pagamenti
- ✅ Verifica dopo cambio chiavi Stripe
- ✅ Troubleshooting pagamenti
- ✅ Audit configurazione Stripe

**Controlli effettuati**:

- 💳 Formato chiavi Stripe (test/live)
- 💳 Connessione account Stripe
- 💳 Webhook endpoints configurati
- 💳 Eventi webhook attivi

---

## 👤 Amministrazione

### `setup-stripe.js`

**Comando**: `npm run setup:stripe`

**Funzionalità**:

- Setup interattivo chiavi Stripe
- Configurazione automatica .env.local
- Validazione formato chiavi
- Istruzioni setup complete

**Utilizzo**:

```bash
npm run setup:stripe
```

**Quando usarlo**:

- ✅ Prima configurazione Stripe
- ✅ Cambio chiavi Stripe
- ✅ Setup ambiente sviluppo
- ✅ Onboarding nuovi sviluppatori

**Processo guidato**:

1. 📋 Istruzioni ottenimento chiavi
2. 🔑 Input chiavi test/live
3. ✅ Validazione formato
4. 📄 Aggiornamento .env.local
5. 🧪 Istruzioni test

### `init-super-admin.js`

**Comando**: `npm run admin:init`

**Funzionalità**:

- Inizializzazione super admin via API
- Chiamata endpoint `/api/admin/init`
- Configurazione flessibile URL
- Diagnostica errori setup

**Utilizzo**:

```bash
npm run admin:init
```

**Quando usarlo**:

- ✅ Setup iniziale super admin
- ✅ Primo deployment produzione
- ✅ Reset configurazione admin
- ✅ Troubleshooting accesso admin

**Configurazione**:

- Legge `NEXT_PUBLIC_APP_URL` o `VERCEL_URL`
- Richiede `SUPER_ADMIN_EMAIL` e `SUPER_ADMIN_PASSWORD`
- Richiede `ALLOW_INIT_API=true`

---

## 🚀 Workflow Consigliati

### Setup Iniziale Progetto

```bash
# 1. Setup ambiente
npm run setup:env

# 2. Setup Stripe (se necessario)
npm run setup:stripe

# 3. Verifica database
npm run db:verify

# 4. Test Stripe (se configurato)
npm run stripe:test
```

### Pre-Deployment Checklist

```bash
# 1. Security scan
npm run security:scan

# 2. Performance check
npm run perf:monitor

# 3. Production readiness
npm run production:check

# 4. Vercel specific (se su Vercel)
npm run vercel:check
```

### Troubleshooting

```bash
# Database issues
npm run db:verify

# Stripe issues
npm run stripe:test

# Performance issues
npm run analyze:bundle
npm run perf:monitor

# Security concerns
npm run security:scan
```

### Manutenzione Periodica

```bash
# Weekly
npm run security:scan
npm run production:check

# Monthly
npm run perf:monitor
npm run analyze:bundle
```

---

## 📊 Exit Codes

Tutti gli script seguono convenzioni standard:

- `0`: Successo
- `1`: Errore/fallimento
- `>1`: Errori specifici

## 🔧 Configurazione

Gli script leggono configurazione da:

- Variabili d'ambiente
- File `.env.local`
- `package.json`
- `next.config.ts`

## 📞 Supporto

Per problemi con gli script:

1. Controlla i log dettagliati
2. Verifica variabili d'ambiente
3. Consulta documentazione specifica
4. Controlla issue GitHub del progetto

---

_Documentazione aggiornata: $(date)_
