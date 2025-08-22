# 🔒 BACKUP CONFIGURAZIONI - iConsorzio

## 📅 **DATA BACKUP:** 20 Agosto 2025
## 🏷️ **TAG:** Pre-aggiornamento Next.js 15 + React 19

---

## 📦 **VERSIONI ATTUALI:**

### **Framework e Librerie Core:**
- **Next.js**: 13.1.6
- **React**: 18.2.0
- **TypeScript**: 5.9.2
- **Node.js**: (versione locale)

### **Database e ORM:**
- **Prisma**: 6.14.0 ✅
- **PostgreSQL**: (versione server)
- **@prisma/client**: 6.14.0

### **UI e Styling:**
- **Tailwind CSS**: 3.2.4
- **@tailwindcss/forms**: (plugin)
- **Heroicons**: 24/outline e 24/solid

### **Autenticazione:**
- **NextAuth.js**: 4.0.6
- **@next-auth/prisma-adapter**: (versione)

### **Utilities:**
- **SWR**: (versione)
- **@headlessui/react**: (versione)
- **Kalend**: (versione calendario)

---

## ⚙️ **CONFIGURAZIONI ATTUALI:**

### **next.config.js:**
```javascript
module.exports = {
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    i18n: {
        defaultLocale: 'it-IT',
        locales: ['it-IT']
    },
    reactStrictMode: true,
    env: {
        DEV_STATUS: process.env.NODE_ENV === 'development'
    }
}
```

### **tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/lib/*": ["lib/*"],
      "@/store/*": ["store/*"],
      "@/components/*": ["components/*"]
    },
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### **tailwind.config.js:**
```javascript
module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

---

## 🗂️ **STRUTTURA PROGETTO:**

### **Directory principali:**
- `/pages` - Pages Router (da migrare ad App Router)
- `/components` - Componenti React
- `/lib` - Utilities e configurazioni
- `/store` - Context e state management
- `/prisma` - Schema database e migrazioni
- `/public` - Asset statici

### **File critici:**
- `pages/index.js` - Homepage
- `pages/dashboard/index.js` - Dashboard principale
- `pages/api/auth/[...nextauth].js` - Autenticazione
- `components/layout/layout.js` - Layout principale
- `lib/db.ts` - Connessione database
- `store/notifications.js` - Sistema notifiche

---

## 🔧 **SCRIPT NPM ATTUALI:**

### **package.json scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## 🚨 **PUNTI DI ATTENZIONE:**

### **Breaking Changes attesi:**
1. **Next.js 13 → 15**: App Router, Server Components
2. **React 18 → 19**: Nuove API, Concurrent Features
3. **TypeScript**: Configurazione più strict
4. **Tailwind CSS**: Nuove classi e sintassi

### **File da modificare:**
1. **next.config.js** - Nuova configurazione
2. **tsconfig.json** - Target moderno
3. **Layout components** - Server Components
4. **API routes** - Nuova struttura
5. **Styling** - Nuove classi Tailwind

---

## 📋 **CHECKLIST PRE-AGGIORNAMENTO:**

- [x] **Backup Git** - Branch `backup-pre-upgrade`
- [x] **Documentazione stato attuale**
- [x] **File configurazioni salvati**
- [x] **Test funzionalità attuali** ✅
- [x] **Prisma 6.x funzionante** ✅

---

## 🔄 **PIANO DI ROLLBACK:**

### **In caso di problemi:**
1. `git checkout backup-pre-upgrade`
2. `npm install` (reinstall dipendenze originali)
3. `npx prisma generate` (rigenera client Prisma)
4. `npm run dev` (riavvia sviluppo)

---

## 📝 **NOTE TECNICHE:**

- **Ambiente**: Windows 10 + PowerShell
- **Database**: PostgreSQL (Vercel)
- **Deployment**: Vercel (auto-deploy su main)
- **Autenticazione**: NextAuth.js con Prisma

---

*Backup creato per il progetto iConsorzio - Parsec S.r.l.*
*Branch: backup-pre-upgrade*
*Commit: cc893de*
