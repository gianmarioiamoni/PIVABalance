# 🛡️ Setup Sistema Amministrazione - PIVABalance

## 📋 **Panoramica**

Il sistema di amministrazione PIVABalance implementa un controllo degli accessi basato sui ruoli con tre livelli:

- **👤 User**: Utente standard con accesso alle funzionalità base
- **🛡️ Admin**: Amministratore con accesso alla gestione utenti e monitoring
- **⚡ Super Admin**: Super amministratore con controllo completo del sistema

## 🚀 **Setup Iniziale**

### 1. **Configurazione Variabili Ambiente**

Aggiungi queste variabili al tuo file `.env.local`:

```bash
# Super Admin Configuration
SUPER_ADMIN_EMAIL=admin@tuodominio.com
SUPER_ADMIN_PASSWORD=TuaPasswordSicura123!
SUPER_ADMIN_NAME=Super Administrator

# Initialization Settings  
ALLOW_INIT_API=true
ENABLE_INIT=false
```

### 2. **Inizializzazione Super Admin**

Hai due opzioni per creare il super admin:

#### **Opzione A: API di Inizializzazione (Consigliata)**

```bash
curl -X POST http://localhost:3000/api/admin/init \
  -H "Content-Type: application/json"
```

#### **Opzione B: Inizializzazione Automatica**

Imposta `ENABLE_INIT=true` nel tuo `.env.local` e riavvia l'applicazione.

### 3. **Verifica Setup**

1. Vai a `/signin`
2. Accedi con le credenziali del super admin
3. Verifica che vedi i link "Monitoring" e "Amministrazione" nel menu

## 🎯 **Funzionalità Admin**

### **👥 Gestione Utenti** (`/dashboard/admin`)
- Visualizzazione lista utenti con filtri e ricerca
- Statistiche utenti (totali, attivi, admin)
- Paginazione per grandi dataset
- Azioni: modifica, eliminazione (in sviluppo)

### **🔍 Monitoring** (`/dashboard/monitoring`)
- Accesso esclusivo per admin
- Dashboard di monitoraggio performance e sicurezza
- Metriche di sistema in tempo reale

### **🛡️ Protezioni Sicurezza**
- Super admin non può eliminare se stesso
- Gerarchia ruoli: `super_admin > admin > user`
- Middleware di autorizzazione per tutte le API admin
- Audit trail per azioni amministrative (futuro)

## 📊 **API Endpoints Admin**

### **GET /api/admin/users**
Lista utenti con filtri e paginazione

**Query Parameters:**
- `page`: Numero pagina (default: 1)
- `limit`: Elementi per pagina (default: 20)
- `search`: Ricerca per nome/email
- `role`: Filtro per ruolo (`user`, `admin`, `super_admin`)
- `active`: Filtro per stato (`true`, `false`)

**Autorizzazione:** Richiede ruolo `admin` o superiore

### **POST /api/admin/init**
Inizializzazione sistema (solo sviluppo)

**Autorizzazione:** Nessuna (protetto da env variables)

## 🔧 **Personalizzazione**

### **Aggiungere Nuovi Ruoli**

1. Aggiorna `UserRole` type in `src/lib/auth/authorization.ts`
2. Modifica `roleHierarchy` nella funzione `hasRole`
3. Aggiorna schema User in `src/models/User.ts`

### **Proteggere Nuove Pagine**

```tsx
import { AdminProtection } from '@/components/auth/AdminProtection';

export default function MyAdminPage() {
  return (
    <AdminProtection requiredRole="admin">
      <MyPageContent />
    </AdminProtection>
  );
}
```

### **Aggiungere Link Menu Admin**

Modifica `baseNavigationItems` in `src/app/dashboard/layout.tsx`:

```tsx
{
  name: 'Nuova Funzione Admin',
  href: '/dashboard/admin/nuova-funzione',
  current: normalizedPathname === '/dashboard/admin/nuova-funzione',
  group: 'admin',
  icon: '🔧',
  requiredRole: 'admin' as const
}
```

## 🚨 **Sicurezza**

### **Raccomandazioni Produzione**

1. **Disabilita API Init**: Imposta `ALLOW_INIT_API=false` in produzione
2. **Password Sicure**: Usa password complesse per super admin
3. **HTTPS**: Assicurati che l'app sia servita via HTTPS
4. **Backup Database**: Implementa backup regolari del database
5. **Monitoring**: Monitora accessi admin e azioni sospette

### **Gestione Password Super Admin**

Per cambiare la password del super admin:

1. Aggiorna `SUPER_ADMIN_PASSWORD` nell'ambiente
2. Riavvia l'applicazione con `ENABLE_INIT=true`
3. Il sistema aggiornerà automaticamente la password

## 🎨 **UI/UX Features**

- **Design Responsivo**: Ottimizzato per mobile, tablet, desktop
- **Filtri Avanzati**: Ricerca in tempo reale e filtri multipli
- **Paginazione**: Gestione efficiente di grandi dataset
- **Feedback Visivo**: Indicatori di stato e messaggi informativi
- **Accessibilità**: ARIA labels e navigazione da tastiera

## 🚀 **Prossimi Sviluppi**

### **Fase 2 - Funzionalità Avanzate**
- Reset password utenti con email
- Sospensione/attivazione account
- Audit log completo delle azioni admin
- Statistiche avanzate utilizzo sistema

### **Fase 3 - Enterprise Features**
- Configurazioni globali sistema
- Template email personalizzati
- Backup/restore dati
- API esportazione dati

## 🆘 **Troubleshooting**

### **Super Admin Non Creato**
- Verifica variabili ambiente `SUPER_ADMIN_EMAIL` e `SUPER_ADMIN_PASSWORD`
- Controlla log console per errori di connessione database
- Assicurati che MongoDB sia in esecuzione

### **Accesso Negato Pagine Admin**
- Verifica che l'utente abbia ruolo `admin` o `super_admin`
- Controlla che il token JWT sia valido
- Verifica che `user.role` sia popolato correttamente

### **API Admin Errore 403**
- Verifica header `Authorization: Bearer <token>`
- Controlla che il middleware di autorizzazione sia configurato
- Verifica che l'endpoint API usi `requireAdmin` middleware

## 📞 **Supporto**

Per problemi o domande sul sistema di amministrazione, verifica:

1. Log dell'applicazione per errori specifici
2. Configurazione variabili ambiente
3. Stato connessione database
4. Validità token JWT

Il sistema è progettato per essere sicuro, scalabile e facile da mantenere seguendo i principi SOLID e le best practice di sicurezza enterprise.
