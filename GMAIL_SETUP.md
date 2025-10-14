# 📧 Configurazione Gmail SMTP per PIVABalance

Questa guida ti aiuta a configurare Gmail SMTP per inviare email automatiche **gratuitamente**.

## 🎯 Cosa Ottieni

- ✅ **Email di benvenuto** automatiche per nuovi utenti
- ✅ **Notifiche admin** quando qualcuno si registra
- ✅ **Completamente gratuito** (500 email/giorno)
- ✅ **Affidabile** e sicuro

## 🚀 Configurazione Rapida

### 1. Abilita l'Autenticazione a 2 Fattori su Gmail

1. Vai su [myaccount.google.com](https://myaccount.google.com)
2. Clicca su **Sicurezza**
3. Abilita **Verifica in due passaggi**

### 2. Genera una Password per le App

1. Nella sezione **Sicurezza**, cerca **Password per le app**
2. Seleziona **Mail** come app
3. Seleziona **Altro** come dispositivo e scrivi "PIVABalance"
4. Copia la **password di 16 caratteri** generata

### 3. Configura le Variabili Environment

Aggiungi queste variabili al tuo file `.env.local`:

```bash
# Gmail SMTP Configuration
GMAIL_USER=tuo-email@gmail.com
GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
ADMIN_EMAIL=gianmarioiamoni1@gmail.com
```

**Importante**: Usa la **password per le app** (16 caratteri), NON la tua password Gmail normale!

## 🧪 Test della Configurazione

Dopo aver configurato le variabili, riavvia l'applicazione:

```bash
npm run dev
```

Quando un utente si registra, vedrai nei log:

```
✅ Gmail SMTP configured successfully
✅ Welcome email sent to: utente@example.com
✅ Admin notification sent to: gianmarioiamoni1@gmail.com
```

## 🔧 Risoluzione Problemi

### Errore: "Invalid login"
- ✅ Verifica che l'autenticazione a 2 fattori sia abilitata
- ✅ Usa la **password per le app**, non quella normale
- ✅ Controlla che `GMAIL_USER` sia corretto

### Errore: "Service unavailable"
- ✅ Controlla la connessione internet
- ✅ Gmail potrebbe avere limiti temporanei

### Email non arrivano
- ✅ Controlla la cartella **Spam**
- ✅ Verifica che l'email destinatario sia corretta
- ✅ Controlla i log dell'applicazione

## 📊 Limiti Gmail Gratuiti

- **500 email/giorno** - Più che sufficiente per la maggior parte dei progetti
- **Nessun costo** - Completamente gratuito
- **Affidabilità alta** - Gmail è molto affidabile

## 🔒 Sicurezza

- ✅ **Password per le app** - Più sicura della password normale
- ✅ **Variabili environment** - Credenziali non nel codice
- ✅ **HTTPS** - Connessione sicura con Gmail

## 🚀 Pronto!

Una volta configurato, il sistema invierà automaticamente:

1. **Email di benvenuto** ai nuovi utenti con:
   - Messaggio personalizzato
   - Link alla dashboard
   - Guida per iniziare

2. **Notifiche admin** a te con:
   - Dettagli del nuovo utente
   - Conteggio totale utenti
   - Link al pannello admin

Tutto **automatico** e **gratuito**! 🎉
