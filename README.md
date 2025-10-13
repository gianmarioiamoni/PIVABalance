# 🚀 P.IVA Balance - Sistema Completo di Gestione Bilancio per Freelancer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-green.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![CI/CD](https://github.com/gianmarioiamoni/PIVABalance/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/gianmarioiamoni/PIVABalance/actions)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

Una soluzione **production-ready** e **open source** per la gestione fiscale di partite IVA, costruita con **Next.js 15**, **TypeScript**, e **MongoDB** seguendo i principi **SOLID** e **TDD**.

## ⭐ **Highlights del Progetto**

- 🎯 **100% SRP Compliance** - Architettura modulare con Single Responsibility Principle
- 📊 **Sistema di Charting Avanzato** - SSR/CSR hybrid con pre-rendering SVG
- 📱 **Mobile-First PWA** - Progressive Web App con ottimizzazioni touch
- 🧪 **63+ Test Completi** - TDD con coverage superiore al 90%
- ⚡ **Performance Ottimizzate** - Build pulito senza warning, bundle ottimizzato
- 🔒 **100% GDPR Compliance** - Privacy by Design con audit trail completo

---

## 🎯 **Funzionalità Principali**

### **💼 Core Business**

- 🔐 **Autenticazione JWT** con refresh token e role-based access control
- ⚙️ **Gestione impostazioni fiscali** (regime forfettario/ordinario)
- 🧾 **Sistema fatturazione** con gestione IVA automatica
- 💰 **Gestione costi** con categorizzazione e deducibilità
- 🧮 **Calcoli fiscali automatici** IRPEF, INPS, casse professionali

### **📊 Analytics & Dashboard**

- 🎛️ **Dashboard personalizzabile** con drag & drop layout
- 📈 **5 Widget finanziari** specializzati (Revenue, Cost, Tax, Profit, CashFlow)
- 🧠 **Business Intelligence** con KPI automatici e insights
- 📄 **Report generation** PDF/Excel/CSV con configurazione avanzata
- 📊 **Advanced charting** con drill-down e filtri multi-criterio

### **📱 Mobile & PWA**

- 🚀 **Progressive Web App** completa con offline support
- 📱 **Touch gestures** - swipe, pinch-to-zoom, fullscreen
- 🎠 **Chart carousel** ottimizzato per mobile
- ⚡ **Performance** - SSR/CSR hybrid per velocità massima

### **🔒 Privacy & Security**

- 🛡️ **100% GDPR Compliance** con Privacy by Design
- 🍪 **Cookie consent management** con audit trail
- 📋 **Data portability** e privacy request automatici
- 👨‍💼 **Admin system** con gestione ruoli (user/admin/super_admin)
- 🔐 **Security** - bcrypt, JWT, input validation, rate limiting

## 🛠 **Tech Stack**

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS
- **Charts**: Recharts con SVG pre-rendering personalizzato
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT + bcrypt + role-based access control
- **State Management**: React Query + Context API
- **Testing**: Jest + Testing Library (90%+ coverage)
- **Validation**: Zod schemas (server + client)
- **PWA**: Service Worker + App Manifest
- **SEO**: Sitemap, Open Graph, Schema.org, GA4

## 🚦 **Quick Start**

```bash
# 1. Clona e installa dipendenze
git clone https://github.com/gianmarioiamoni/PIVABalance.git
cd PIVABalance
npm install

# 2. Configura environment variables
cp .env.example .env.local
# Modifica .env.local con i tuoi dati (MongoDB URI, JWT Secret, etc.)

# 3. Avvia MongoDB (Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 4. Avvia development server
npm run dev

# 5. Apri http://localhost:3000
```

### **Environment Variables Essenziali**

```env
MONGODB_URI=mongodb://localhost:27017/p-iva-balance
JWT_SECRET=your-super-secure-jwt-secret-key-here
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PASSWORD=your-secure-password
```

---

## 🏗️ **Architettura**

Il progetto segue rigorosamente i **principi SOLID** con architettura modulare:

- **📱 App Router**: Next.js 15 con routing file-based
- **🧩 Components**: SRP-compliant, 46+ componenti specializzati
- **🪝 Hooks**: Custom hooks per ogni funzionalità specifica
- **🔧 Services**: Business logic separata dalla UI
- **🗃️ Models**: MongoDB models con validazione Zod
- **🎯 Types**: TypeScript 100% type-safe (zero `any`)

### **Struttura Directory Principale**

```
src/
├── app/          # Next.js App Router + API Routes
├── components/   # UI components (charts, widgets, dashboard)
├── hooks/        # Custom hooks specializzati
├── services/     # Business logic services
├── models/       # MongoDB models
├── types/        # TypeScript definitions
└── utils/        # Pure utility functions
```

## 🧪 **Testing & Development**

- **TDD Approach**: Test-first development con 63+ test suites
- **Coverage**: 90%+ per componenti critici (auth, calculations, business logic)
- **Test Types**: Unit, Integration, Component testing con Jest + Testing Library
- **CI/CD**: Automated testing + build verification
- **Code Quality**: ESLint + TypeScript strict mode + zero `any` types

```bash
npm test              # Esegui tutti i test
npm run test:coverage # Coverage report
npm run test:watch    # Watch mode per development
npm run build         # Build production (zero warnings)
```

---

## 🚀 **Production Ready**

### **Performance Metrics**

- ⚡ **First Paint**: ~100ms (87% faster)
- 📦 **Bundle Size**: 15KB initial (97% smaller)
- 📱 **Mobile Performance**: 95/100 Lighthouse
- 🔍 **SEO Score**: 100/100

### **Deployment**

```bash
# Vercel (Recommended)
npm i -g vercel && vercel

# Docker
docker build -t piva-balance . && docker run -p 3000:3000 piva-balance

# Manual
npm run build && npm run start
```

---

## 🤝 **Contributing**

Questo è un progetto **open source** - i contributi sono benvenuti!

### **Come Contribuire**

1. Fork il repository
2. Crea un branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Apri una Pull Request

### **Guidelines**

- **TypeScript**: Zero `any` types, validazione Zod
- **Testing**: Minimo 80% coverage per nuovo codice
- **Architecture**: Segui principi SOLID e SRP
- **Mobile-first**: Design responsive obbligatorio

Leggi la [guida completa](CONTRIBUTING.md) per tutti i dettagli.

---

## 📚 **Documentation Links**

### **🏗️ Architecture & Development**

- [🎛️ Widget System Architecture](docs/architecture/WIDGET_SYSTEM_ARCHITECTURE.md)
- [📊 Chart Architecture](docs/architecture/ARCHITECTURE.md)
- [📱 Mobile SSR/CSR](docs/architecture/SSR_CSR_ARCHITECTURE.md)
- [🎨 SVG Pre-rendering](docs/architecture/PRERENDERING.md)
- [🧩 SRP Analysis](docs/architecture/SKELETON_SRP_ANALYSIS.md)
- [⚡ Performance Report](docs/performance/PERFORMANCE_AUDIT_REPORT.md)
- [🎨 Design System](docs/architecture/DESIGN_SYSTEM.md)
- [📚 Documentation Index](docs/DOCUMENTATION_INDEX.md)

### **🔒 GDPR & Privacy Compliance**

- [🛡️ GDPR Compliance Audit](docs/gdpr-compliance/GDPR_COMPLIANCE_AUDIT.md)
- [📋 Processing Activities Register](docs/gdpr-compliance/REGISTRO_TRATTAMENTI_GDPR.md)
- [👨‍💼 Admin System Setup](docs/gdpr-compliance/ADMIN_SETUP.md)

### **🚀 Development & Deployment**

- [🔧 Environment Setup](docs/development/ENVIRONMENT_SETUP.md)
- [🗺️ Development Roadmap](docs/development/ROADMAP.md)
- [🚀 Deployment Guide](docs/deployment/DEPLOYMENT_NOTES.md)

---

## 📄 **License & Support**

- **License**: MIT
- **Support**: GitHub Issues
- **Documentation**: Comprehensive in-code docs
- **Architecture**: SOLID + TDD principles

---

**🎯 Costruito con ❤️ seguendo SOLID principles, TDD methodology, e modern web standards per fornire la migliore esperienza di gestione fiscale per freelance e partite IVA.**
