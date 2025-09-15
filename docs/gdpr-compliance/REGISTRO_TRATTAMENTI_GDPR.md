# 📋 **Registro delle Attività di Trattamento**
## **PIVABalance - Art. 30 GDPR**

**Data Creazione:** 15 Settembre 2025  
**Versione:** 1.0  
**Responsabile DPO:** privacy@pivabalance.com  
**Prossima Revisione:** 15 Marzo 2026

---

## 📖 **Informazioni Generali**

### **Titolare del Trattamento**
- **Denominazione:** PIVABalance
- **Natura:** Sistema di gestione finanziaria per Partite IVA
- **Contatto DPO:** privacy@pivabalance.com
- **Sede:** Italia (UE)

### **Base Normativa**
- **GDPR Art. 30:** Registro delle attività di trattamento
- **D.Lgs. 196/2003:** Codice Privacy Italiano
- **Direttiva ePrivacy 2002/58/CE**

---

## 🗂️ **TRATTAMENTI REGISTRATI**

### **TRATTAMENTO #1: GESTIONE ACCOUNT UTENTI**

| **Campo** | **Dettaglio** |
|-----------|---------------|
| **Nome Trattamento** | Gestione Account e Autenticazione Utenti |
| **Finalità** | Creazione, gestione e autenticazione account utenti |
| **Base Legale** | Art. 6.1.b GDPR - Esecuzione contratto |
| **Categorie Interessati** | Utenti registrati (Partite IVA) |
| **Categorie Dati** | Email, Nome, Cognome, Password (hash), Data registrazione |
| **Destinatari** | Solo personale autorizzato PIVABalance |
| **Trasferimenti Extra-UE** | Nessuno |
| **Conservazione** | Durata account + 30 giorni per backup |
| **Misure Sicurezza** | Hash BCrypt, HTTPS/TLS, Autenticazione JWT |

---

### **TRATTAMENTO #2: GESTIONE DATI FINANZIARI**

| **Campo** | **Dettaglio** |
|-----------|---------------|
| **Nome Trattamento** | Elaborazione e Conservazione Dati Finanziari |
| **Finalità** | Servizio contabilità, calcolo tasse, report finanziari |
| **Base Legale** | Art. 6.1.b GDPR (contratto) + Art. 6.1.c GDPR (obbligo legale) |
| **Categorie Interessati** | Utenti registrati, Clienti fatturati |
| **Categorie Dati** | Fatture, Costi, Importi, Date, Descrizioni, Dati clienti |
| **Destinatari** | Solo utente proprietario + admin per supporto |
| **Trasferimenti Extra-UE** | Nessuno |
| **Conservazione** | 10 anni (obbligo fiscale D.P.R. 600/1973) |
| **Misure Sicurezza** | Crittografia DB, Backup automatici, Access control |

---

### **TRATTAMENTO #3: IMPOSTAZIONI FISCALI**

| **Campo** | **Dettaglio** |
|-----------|---------------|
| **Nome Trattamento** | Configurazione Parametri Fiscali Utente |
| **Finalità** | Calcolo tasse, regime fiscale, contributi INPS |
| **Base Legale** | Art. 6.1.b GDPR - Esecuzione contratto |
| **Categorie Interessati** | Utenti registrati (Partite IVA) |
| **Categorie Dati** | Regime fiscale, Aliquote, Codice ATECO, Cassa previdenziale |
| **Destinatari** | Solo utente proprietario + admin per supporto |
| **Trasferimenti Extra-UE** | Nessuno |
| **Conservazione** | Durata account utente |
| **Misure Sicurezza** | Validazione input, Crittografia DB, RBAC |

---

### **TRATTAMENTO #4: GESTIONE COOKIE E CONSENSI**

| **Campo** | **Dettaglio** |
|-----------|---------------|
| **Nome Trattamento** | Gestione Cookie e Tracciamento Consensi |
| **Finalità** | Cookie tecnici, funzionali, analytics, marketing |
| **Base Legale** | Art. 6.1.a GDPR (consenso) + Art. 6.1.f GDPR (legittimo interesse) |
| **Categorie Interessati** | Tutti i visitatori del sito |
| **Categorie Dati** | Preferenze cookie, Data consenso, IP address, User agent |
| **Destinatari** | PIVABalance, Google Analytics (se consenso) |
| **Trasferimenti Extra-UE** | Google LLC (USA) - Adequacy Decision |
| **Conservazione** | 1 anno (consenso), 12 mesi (cookie analytics) |
| **Misure Sicurezza** | Consenso granulare, localStorage client, Anonimizzazione IP |

---

### **TRATTAMENTO #5: AMMINISTRAZIONE SISTEMA**

| **Campo** | **Dettaglio** |
|-----------|---------------|
| **Nome Trattamento** | Gestione Admin e Monitoraggio Sistema |
| **Finalità** | Amministrazione utenti, supporto tecnico, sicurezza |
| **Base Legale** | Art. 6.1.f GDPR - Interesse legittimo (sicurezza) |
| **Categorie Interessati** | Utenti admin, Super admin, Utenti con problemi |
| **Categorie Dati** | Log accessi, Ruoli, Azioni admin, Timestamp, IP |
| **Destinatari** | Solo admin e super admin autorizzati |
| **Trasferimenti Extra-UE** | Nessuno |
| **Conservazione** | 12 mesi (log), Durata ruolo (admin data) |
| **Misure Sicurezza** | RBAC avanzato, Audit trail, Segregazione super admin |

---

### **TRATTAMENTO #6: SUPPORTO CLIENTI**

| **Campo** | **Dettaglio** |
|-----------|---------------|
| **Nome Trattamento** | Gestione Richieste Supporto e Privacy |
| **Base Legale** | Art. 6.1.f GDPR - Interesse legittimo (supporto) |
| **Finalità** | Assistenza tecnica, esercizio diritti GDPR |
| **Categorie Interessati** | Utenti che richiedono supporto |
| **Categorie Dati** | Email, Nome, Descrizione problema, Cronologia supporto |
| **Destinatari** | Team supporto PIVABalance |
| **Trasferimenti Extra-UE** | Nessuno |
| **Conservazione** | 2 anni dalla risoluzione |
| **Misure Sicurezza** | Accesso limitato team supporto, Crittografia email |

---

## 🔐 **MISURE DI SICUREZZA GENERALI**

### **Misure Tecniche**
- ✅ **Crittografia in transito:** HTTPS/TLS 1.3
- ✅ **Crittografia a riposo:** MongoDB Atlas encryption
- ✅ **Hashing password:** BCrypt (12 rounds)
- ✅ **Autenticazione:** JWT con scadenza
- ✅ **Controllo accessi:** RBAC (user/admin/super_admin)
- ✅ **Validazione input:** Zod + Mongoose schemas
- ✅ **Backup automatici:** MongoDB Atlas (daily)

### **Misure Organizzative**
- ✅ **Formazione personale:** Privacy by design
- ✅ **Accesso su necessità:** Principio least privilege
- ✅ **Audit regolari:** Revisione accessi e log
- ✅ **Incident response:** Procedura breach notification
- ✅ **DPO designato:** privacy@pivabalance.com
- ✅ **Revisione periodica:** Semestrale (Marzo/Settembre)

---

## 📊 **TRASFERIMENTI DATI**

### **Fornitori di Servizi (Art. 28 GDPR)**

| **Fornitore** | **Servizio** | **Ubicazione** | **Garanzie** |
|---------------|-------------|----------------|--------------|
| **MongoDB Atlas** | Database hosting | UE (Irlanda) | DPA firmato, Certificazione ISO 27001 |
| **Google Analytics** | Analytics (se consenso) | USA | Adequacy Decision, Data Processing Amendment |
| **Vercel/Netlify** | Hosting applicazione | UE/USA | GDPR compliance, DPA disponibile |

### **Nessun Trasferimento a Paesi Terzi**
- ✅ Tutti i dati personali rimangono in UE
- ✅ MongoDB Atlas: region EU (Irlanda)
- ✅ Google Analytics: solo con consenso utente
- ✅ Hosting: preferenza provider UE

---

## 📋 **DIRITTI DEGLI INTERESSATI**

### **Modalità di Esercizio**
| **Diritto** | **Modalità** | **Tempi Risposta** |
|-------------|-------------|-------------------|
| **Accesso (Art. 15)** | privacy@pivabalance.com | 30 giorni |
| **Rettifica (Art. 16)** | Account Settings | Immediato |
| **Cancellazione (Art. 17)** | Account → Zona Pericolosa | Immediato |
| **Portabilità (Art. 20)** | Account → Diritti Privacy | Immediato |
| **Opposizione (Art. 21)** | Cookie Settings | Immediato |
| **Limitazione (Art. 18)** | privacy@pivabalance.com | 30 giorni |

### **Procedure Interne**
- ✅ **Verifica identità:** Richiesta autenticazione
- ✅ **Valutazione richiesta:** Check validità e applicabilità
- ✅ **Esecuzione:** Automatica (quando possibile) o manuale
- ✅ **Comunicazione:** Conferma scritta entro 30 giorni
- ✅ **Registro richieste:** Log interno per audit

---

## 🚨 **GESTIONE INCIDENTI**

### **Procedura Data Breach**
1. **Rilevazione:** Monitoring automatico + segnalazioni
2. **Valutazione:** Risk assessment entro 24 ore
3. **Contenimento:** Misure immediate per limitare danno
4. **Notifica Garante:** Entro 72 ore (se alto rischio)
5. **Comunicazione utenti:** Entro 72 ore (se alto rischio)
6. **Documentazione:** Registro interno incidenti
7. **Remediation:** Misure correttive e preventive

### **Contatti Emergenza**
- **DPO:** privacy@pivabalance.com
- **Technical Team:** support@pivabalance.com
- **Garante Privacy:** https://www.garanteprivacy.it

---

## 📅 **CRONOLOGIA REVISIONI**

| **Data** | **Versione** | **Modifiche** | **Responsabile** |
|----------|-------------|---------------|-----------------|
| 15/09/2025 | 1.0 | Creazione registro iniziale | DPO PIVABalance |
| | | Definizione 6 trattamenti principali | |
| | | Implementazione misure sicurezza | |

### **Prossima Revisione Programmata**
- **Data:** 15 Marzo 2026
- **Scope:** Revisione completa trattamenti e misure sicurezza
- **Responsabile:** DPO PIVABalance

---

## ✅ **DICHIARAZIONE DI CONFORMITÀ**

> Questo registro è stato redatto in conformità all'Art. 30 del GDPR (Regolamento UE 2016/679) e contiene tutte le informazioni richieste per le attività di trattamento di PIVABalance.
>
> Il registro è mantenuto aggiornato e disponibile per le autorità di controllo su richiesta.
>
> **Responsabile:** DPO PIVABalance  
> **Data:** 15 Settembre 2025  
> **Firma digitale:** privacy@pivabalance.com

---

**© 2025 PIVABalance - Registro Trattamenti GDPR Art. 30**
