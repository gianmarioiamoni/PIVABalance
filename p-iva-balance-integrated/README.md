# P.IVA Balance - Progetto Integrato

Una soluzione completa per la gestione fiscale di partite IVA, costruita con Next.js 15, TypeScript, e MongoDB seguendo i principi SOLID e TDD.

## 🚀 Features

- ✅ **Autenticazione completa** con JWT
- ✅ **Gestione impostazioni fiscali** (regime forfettario/ordinario)
- ✅ **Fatturazione** con gestione IVA
- ✅ **Gestione costi** deducibili/non deducibili
- ✅ **Calcoli fiscali automatici**
- ✅ **API Routes integrate** con Next.js
- ✅ **Type Safety** completo (no `any` types)
- ✅ **Test completi** con Jest e Testing Library

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Autenticazione**: JWT
- **Validazione**: Zod
- **Testing**: Jest, Testing Library, MongoDB Memory Server
- **State Management**: React Query

## 📁 Struttura del Progetto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (backend)
│   ├── (auth)/            # Pagine autenticazione
│   └── dashboard/         # Dashboard protetta
├── components/            # Componenti React riutilizzabili
├── hooks/                 # Custom hooks
├── lib/                   # Utilities e configurazioni
│   ├── auth/              # JWT e autenticazione
│   ├── database/          # Connessione MongoDB
│   └── validations/       # Schemi Zod
├── models/                # Modelli Mongoose
├── providers/             # Context providers
├── services/              # Logica business
├── types/                 # Tipi TypeScript condivisi
└── utils/                 # Utility functions
```

## 🚦 Quick Start

### 1. Setup Ambiente

```bash
# Clona il progetto
cd p-iva-balance-integrated

# Installa dipendenze
npm install

# Crea file environment
cp .env.example .env.local
```

### 2. Configura le Variabili d'Ambiente

Crea `.env.local`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/p-iva-balance

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security
BCRYPT_SALT_ROUNDS=12
```

### 3. Avvia MongoDB

```bash
# Con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# O usa MongoDB Atlas (cloud)
```

### 4. Sviluppo

```bash
# Avvia il server di sviluppo
npm run dev

# Esegui i test
npm test

# Esegui test in watch mode
npm run test:watch

# Coverage dei test
npm run test:coverage
```

## 🧪 Testing

Il progetto segue l'approccio **Test-Driven Development (TDD)**:

```bash
# Esegui tutti i test
npm test

# Test specifici
npm test -- auth
npm test -- models
npm test -- api

# Test con coverage
npm run test:coverage

# Test in modalità CI
npm run test:ci
```

## 📚 API Documentation

### Autenticazione

#### POST `/api/auth/register`

Registra un nuovo utente.

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "Nome Utente"
}
```

#### POST `/api/auth/login`

Autentica un utente esistente.

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### GET `/api/auth/me`

Ottiene informazioni dell'utente autenticato.
Richiede header: `Authorization: Bearer <token>`

### Altre API Routes

Le API routes seguono il pattern RESTful:

- `/api/invoices` - Gestione fatture
- `/api/costs` - Gestione costi
- `/api/settings` - Impostazioni utente
- `/api/professional-funds` - Casse professionali

## 🏗 Architettura SOLID

Il progetto segue rigorosamente i principi SOLID:

### **S** - Single Responsibility Principle

Ogni classe/modulo ha una singola responsabilità:

- `JwtService` gestisce solo JWT
- `User` model gestisce solo dati utente
- Ogni API route gestisce un singolo endpoint

### **O** - Open/Closed Principle

Il codice è aperto all'estensione ma chiuso alla modifica:

- Schemi Zod facilmente estensibili
- Middleware componibili
- Plugin system per nuove features

### **L** - Liskov Substitution Principle

Le implementazioni possono essere sostituite senza rompere il codice:

- Interfacce ben definite
- Dependency injection dove appropriato

### **I** - Interface Segregation Principle

Interfacce specifiche e focused:

- API routes con responsabilità specifiche
- Hook specializzati per funzionalità specifiche

### **D** - Dependency Inversion Principle

Dipendenze da astrazioni, non da implementazioni concrete:

- Services iniettabili
- Database connection astratta
- Testing con mock facilmente intercambiabili

## 🔒 Sicurezza

- **Password Hashing**: bcrypt con salt rounds configurabili
- **JWT Security**: Token firmati con secret robusto
- **Input Validation**: Validazione server-side con Zod
- **SQL Injection Prevention**: MongoDB con Mongoose
- **XSS Prevention**: Sanitizzazione input
- **CSRF Protection**: (da implementare in produzione)

## 🚀 Deploy

### Vercel (Raccomandato)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configura le environment variables su Vercel dashboard
```

### Docker

```dockerfile
# Dockerfile incluso per deploy containerizzato
docker build -t p-iva-balance .
docker run -p 3000:3000 p-iva-balance
```

## 🤝 Contribuire

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. **Scrivi i test prima** (TDD approach)
4. Implementa la feature
5. Assicurati che tutti i test passino
6. Commit (`git commit -m 'Add some AmazingFeature'`)
7. Push al branch (`git push origin feature/AmazingFeature`)
8. Apri una Pull Request

## 📄 License

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per i dettagli.

## 🆘 Support

Per supporto o domande:

- Apri un [Issue](../issues)
- Contatta il team di sviluppo

---

**Costruito con ❤️ seguendo i principi SOLID e TDD**
