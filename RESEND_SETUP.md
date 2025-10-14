# 📧 Configurazione Resend per Sistema Email

## 🎯 **Panoramica**

PIVABalance utilizza **Resend** per l'invio di email production-ready:

- ✅ **Email di benvenuto** per nuovi utenti
- ✅ **Notifiche admin** per nuove registrazioni
- ✅ **Ricevute donazioni** per i sostenitori

---

## 🚀 **Setup Resend (5 minuti)**

### **1. Crea Account Resend**

1. Vai su: https://resend.com
2. **Registrati** (gratuito - 3000 email/mese)
3. **Verifica email** di conferma

### **2. Ottieni API Key**

1. **Login** su Resend Dashboard
2. Vai su **API Keys** nel menu laterale
3. **Crea nuova API Key**:
   - Name: `PIVABalance Production`
   - Permission: `Sending access`
4. **Copia la chiave** (inizia con `re_`)

### **3. Configura Dominio (Opzionale ma Consigliato)**

Per email professionali da `noreply@tuodominio.com`:

1. Vai su **Domains** in Resend
2. **Add Domain** → inserisci il tuo dominio
3. **Aggiungi record DNS** come indicato da Resend
4. **Verifica dominio** (può richiedere qualche minuto)

---

## ⚙️ **Configurazione Environment Variables**

### **Development (.env.local)**

```env
# Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@pivabalance.com
ADMIN_EMAIL=gianmarioiamoni1@gmail.com
SUPPORT_EMAIL=gianmarioiamoni1@gmail.com
```

### **Production (Vercel)**

1. Vai su **Vercel Dashboard**
2. Seleziona il progetto PIVABalance
3. **Settings** → **Environment Variables**
4. Aggiungi:

```env
RESEND_API_KEY=re_your_production_api_key_here
EMAIL_FROM=noreply@tuodominio.com
ADMIN_EMAIL=gianmarioiamoni1@gmail.com
SUPPORT_EMAIL=gianmarioiamoni1@gmail.com
```

---

## 🧪 **Test del Sistema**

### **1. Test Registrazione Utente**

```bash
# Avvia il server
npm run dev

# Registra un nuovo utente su http://localhost:3000/signup
# Controlla i log del server per conferma invio email
```

### **2. Verifica Email Inviate**

1. **Resend Dashboard** → **Logs**
2. Dovresti vedere:
   - ✅ Welcome email inviata al nuovo utente
   - ✅ Admin notification inviata a te

### **3. Test Donazioni**

```bash
# Vai su http://localhost:3000/donations
# Effettua una donazione di test
# Controlla che arrivi la ricevuta email
```

---

## 📊 **Monitoraggio**

### **Dashboard Resend**

- **Logs**: Tutte le email inviate
- **Analytics**: Statistiche di consegna
- **Bounces**: Email non consegnate
- **Complaints**: Segnalazioni spam

### **Console Logs**

Il sistema logga sempre:

```
✅ Welcome email sent successfully to: user@example.com
📧 Email ID: re_abc123def456
```

---

## 🔧 **Troubleshooting**

### **Email non inviate**

1. **Controlla API Key**:

   ```bash
   echo $RESEND_API_KEY  # Deve iniziare con 're_'
   ```

2. **Verifica logs**:

   ```bash
   # Cerca nei logs del server
   📧 RESEND_API_KEY not configured  # ❌ API key mancante
   ✅ Welcome email sent successfully  # ✅ Tutto ok
   ```

3. **Testa API Key**:
   ```bash
   curl -X POST 'https://api.resend.com/emails' \
     -H 'Authorization: Bearer re_your_api_key' \
     -H 'Content-Type: application/json' \
     -d '{"from":"test@resend.dev","to":"test@example.com","subject":"Test","html":"Test"}'
   ```

### **Email in Spam**

1. **Configura dominio** personalizzato
2. **Aggiungi SPF/DKIM** records
3. **Evita parole spam** nei subject

### **Rate Limits**

- **Free Plan**: 3000 email/mese, 100/giorno
- **Paid Plan**: Limiti più alti
- Il sistema gestisce automaticamente gli errori

---

## 💰 **Costi**

### **Piano Gratuito**

- ✅ **3000 email/mese**
- ✅ **100 email/giorno**
- ✅ **Perfetto per iniziare**

### **Piano Pro ($20/mese)**

- ✅ **50,000 email/mese**
- ✅ **Dominio personalizzato**
- ✅ **Analytics avanzate**

---

## 🔒 **Sicurezza**

### **API Key Security**

- ✅ **Mai committare** API keys nel codice
- ✅ **Usa environment variables**
- ✅ **Rigenera keys** se compromesse
- ✅ **Permessi minimi** (solo sending)

### **Email Content**

- ✅ **Validazione email** automatica
- ✅ **Sanitizzazione input**
- ✅ **Rate limiting** integrato
- ✅ **Error handling** robusto

---

## 📈 **Metriche di Successo**

Dopo il setup, dovresti vedere:

- ✅ **Delivery Rate**: >95%
- ✅ **Open Rate**: ~20-30% (benvenuto)
- ✅ **Bounce Rate**: <2%
- ✅ **Spam Rate**: <0.1%

---

## 🆘 **Supporto**

- **Resend Docs**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **PIVABalance Issues**: GitHub Issues

---

**🎉 Una volta configurato, il sistema email funzionerà automaticamente per tutte le registrazioni e donazioni!**
