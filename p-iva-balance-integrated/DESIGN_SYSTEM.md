# 🎨 Design System Centralizzato - P.IVA Balance

Sistema di design centralizzato basato su **Tailwind CSS v4** con supporto completo per tema chiaro/scuro e gestione semantica dei colori.

## 📋 Indice

- [🎯 Panoramica](#-panoramica)
- [🌈 Sistema Colori](#-sistema-colori)
- [🎨 Temi](#-temi)
- [🔧 Componenti Base](#-componenti-base)
- [📝 Typography](#-typography)
- [🏗️ Layout](#️-layout)
- [⚡ Utilizzo](#-utilizzo)
- [🔄 Migrazione](#-migrazione)

## 🎯 Panoramica

Il sistema di design centralizzato permette di:

- ✅ **Gestione centralizzata** di colori, font, spacing
- ✅ **Tema chiaro/scuro** automatico con persistenza
- ✅ **Coerenza visiva** garantita su tutti i componenti
- ✅ **Manutenibilità** semplificata
- ✅ **Performance** ottimizzata con CSS custom properties

## 🌈 Sistema Colori

### Design Tokens Semantici

```css
/* Brand Colors */
--brand-primary: #3b82f6      /* Blu principale */
--brand-secondary: #6366f1    /* Indaco secondario */
--brand-accent: #8b5cf6       /* Viola accent */

/* Surface Colors */
--surface-primary: #ffffff     /* Background principale */
--surface-secondary: #f9fafb   /* Background secondario */
--surface-tertiary: #f3f4f6    /* Background terziario */
--surface-border: #e5e7eb      /* Bordi */
--surface-hover: #f3f4f6       /* Hover states */

/* Text Colors */
--text-primary: #111827        /* Testo principale */
--text-secondary: #374151      /* Testo secondario */
--text-tertiary: #6b7280       /* Testo terziario */
--text-quaternary: #9ca3af     /* Testo quaternario */
--text-inverse: #ffffff        /* Testo inverso */

/* Status Colors */
--status-success: #10b981      /* Verde successo */
--status-warning: #f59e0b      /* Giallo warning */
--status-error: #ef4444        /* Rosso errore */
--status-info: #3b82f6         /* Blu informazione */
```

### Classi Utility

```html
<!-- Surface Classes -->
<div class="surface-primary">Background principale</div>
<div class="surface-secondary">Background secondario</div>

<!-- Text Classes -->
<h1 class="text-primary">Testo principale</h1>
<p class="text-secondary">Testo secondario</p>
<span class="text-tertiary">Testo terziario</span>

<!-- Status Classes -->
<div class="status-success">Messaggio di successo</div>
<div class="status-error">Messaggio di errore</div>
```

## 🎨 Temi

### Supporto Automatico

Il sistema supporta automaticamente:

- **Light Theme**: Tema chiaro (default)
- **Dark Theme**: Tema scuro con colori complementari
- **System Theme**: Segue le preferenze del sistema

### Implementazione

```tsx
import { ThemeProvider, ThemeToggle } from '@/components/ui';

// Provider nell'app
<ThemeProvider>
  {children}
</ThemeProvider>

// Toggle del tema
<ThemeToggle variant="icon" />
<ThemeToggle variant="button" showLabel />
<ThemeToggle variant="dropdown" />
```

### Hook di Gestione

```tsx
import { useThemeContext } from "@/components/ui";

const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeContext();

// Cambiare tema
setTheme("dark"); // light | dark | system
toggleTheme(); // toggle tra light/dark
```

## 🔧 Componenti Base

### Bottoni

```html
<!-- Stili predefiniti -->
<button class="btn-primary">Azione Principale</button>
<button class="btn-secondary">Azione Secondaria</button>
<button class="btn-success">Successo</button>
<button class="btn-warning">Attenzione</button>
<button class="btn-error">Errore</button>
```

### Input e Form

```html
<!-- Input base -->
<input class="input-base" type="text" placeholder="Inserisci testo" />

<!-- Form con validazione -->
<input class="input-base border-error focus:border-error focus:ring-error" />
```

### Card

```html
<div class="card">
  <div class="card-header">
    <h3>Titolo Card</h3>
  </div>
  <div class="card-body">
    <p>Contenuto della card</p>
  </div>
  <div class="card-footer">
    <button class="btn-primary">Azione</button>
  </div>
</div>
```

### Status & Feedback

```html
<div class="status-success p-3 rounded-md">
  Operazione completata con successo
</div>

<div class="status-error p-3 rounded-md">Si è verificato un errore</div>
```

## 📝 Typography

### Heading

```html
<h1 class="heading-xl">Extra Large Heading</h1>
<h2 class="heading-lg">Large Heading</h2>
<h3 class="heading-md">Medium Heading</h3>
<h4 class="heading-sm">Small Heading</h4>
```

### Body Text

```html
<p class="body-lg">Large body text</p>
<p class="body-md">Medium body text</p>
<p class="body-sm">Small body text</p>
```

## 🏗️ Layout

### Container

```html
<div class="container-app">
  <!-- Contenuto con max-width e padding responsivo -->
</div>
```

### Navbar

```html
<nav class="navbar-base">
  <!-- Navbar con stili predefiniti -->
</nav>
```

## ⚡ Utilizzo

### 1. Componenti con Design System

```tsx
// Prima (manuale)
<div className="bg-white border border-gray-200 rounded-lg shadow-md">
  <div className="px-6 py-4">
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      Salva
    </button>
  </div>
</div>

// Dopo (centralizzato)
<div className="card">
  <div className="card-body">
    <button className="btn-primary px-4 py-2">
      Salva
    </button>
  </div>
</div>
```

### 2. StatCard Aggiornata

```tsx
<StatCard
  title="Fatture Mese"
  value="€2,450"
  icon={<DocumentIcon />}
  variant="primary" // primary | secondary | success | warning | info
/>
```

### 3. Theme Toggle

```tsx
// Icona semplice
<ThemeToggle variant="icon" />

// Bottone con label
<ThemeToggle variant="button" showLabel />

// Dropdown con opzioni
<ThemeToggle variant="dropdown" />
```

## 🔄 Migrazione

### Colori Legacy → Design System

```tsx
// ❌ Prima
className = "bg-white text-gray-900 border-gray-200";

// ✅ Dopo
className = "surface-primary text-primary border-surface-border";

// ❌ Prima
className = "bg-blue-500 hover:bg-blue-600 text-white";

// ✅ Dopo
className = "btn-primary";
```

### Componenti Legacy → Centralizzati

```tsx
// ❌ Prima
<div className="bg-white shadow rounded-lg border border-gray-200 p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Titolo</h3>
  <p className="text-gray-600">Contenuto</p>
</div>

// ✅ Dopo
<div className="card">
  <div className="card-body">
    <h3 className="heading-sm mb-4">Titolo</h3>
    <p className="text-secondary">Contenuto</p>
  </div>
</div>
```

## 🎯 Best Practices

### 1. Usa Classi Semantiche

```tsx
// ✅ Buono - Semantico
<button className="btn-primary">Salva</button>
<p className="text-secondary">Descrizione</p>

// ❌ Evita - Specifico
<button className="bg-blue-500 text-white px-4 py-2">Salva</button>
<p className="text-gray-600">Descrizione</p>
```

### 2. Combina con Utility Classes

```tsx
// ✅ Combina design system + utility
<div className="card mb-6">
  <div className="card-body flex items-center space-x-4">
    <button className="btn-primary flex-1">Salva</button>
  </div>
</div>
```

### 3. Responsive Design

```tsx
// ✅ Responsive con design system
<div className="card p-4 lg:p-6">
  <h2 className="heading-md lg:heading-lg">Titolo</h2>
</div>
```

### 4. Animazioni

```tsx
// ✅ Usa animazioni predefinite
<div className="card animate-fade-in">
  <div className="animate-slide-up">Contenuto</div>
</div>
```

## 🚀 Vantaggi

- **🎨 Consistenza**: Tutti i componenti seguono lo stesso design language
- **🌙 Dark Mode**: Supporto automatico senza modifiche ai componenti
- **📱 Responsive**: Design system ottimizzato per tutti i dispositivi
- **⚡ Performance**: CSS custom properties con ottimizzazioni Tailwind
- **🔧 Manutenibilità**: Modifica centralizzata di colori e stili
- **♿ Accessibilità**: Focus states e contrasti ottimizzati

## 🎉 Risultato

Con questo sistema di design centralizzato, puoi:

1. **Cambiare l'intero tema** modificando solo le CSS custom properties
2. **Aggiungere nuovi colori brand** senza toccare i componenti
3. **Supportare automaticamente** il dark mode su tutti i componenti
4. **Mantenere coerenza** visiva garantita
5. **Sviluppare più velocemente** con classi semantiche predefinite

---

_Sistema implementato con Tailwind CSS v4 e best practices moderne per garantire performance, accessibilità e manutenibilità._
