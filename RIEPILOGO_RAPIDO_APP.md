# 🚀 RIEPILOGO RAPIDO APPLICAZIONE ICONSORZIO

## 📋 INFORMAZIONI ESSENZIALI
- **App:** Sistema gestione autoscuole multi-company
- **Stack:** Next.js 13.1.6 + React 18.2.0 + Prisma 6.14.0 + PostgreSQL
- **Versione:** Commit ae904ac (stabile)
- **File:** 31,479 totali, 21,279 di codice

---

## 🏗️ ARCHITETTURA CHIAVE

### **Frontend:**
- Pages Router (non App Router)
- Tailwind CSS + Context API
- SWR per data fetching

### **Backend:**
- Next.js API Routes
- NextAuth.js per autenticazione
- Prisma ORM + PostgreSQL

### **Database:**
- 15+ modelli (Company, User, Allievo, Veicolo, etc.)
- Sistema multi-company completo
- 50+ migrazioni dal 2021

---

## 🧩 COMPONENTI PRINCIPALI

### **Core:**
- `components/layout/layout.js` - Layout principale (46KB)
- `components/auth/auth-form.js` - Login (16KB)
- `components/allievi/form.js` - Form allievi (61KB)

### **Admin:**
- User, Rules, Workplace, Patenti management
- Sistema permessi basato su regole

### **UI Design System:**
- Button, Input, Modal, Table, Select, Toast, Card
- Sistema notifiche completo

---

## 🔌 API ENDPOINTS CHIAVE

### **Admin:**
- `/api/admin/rules/` - Sistema permessi
- `/api/admin/users/` - Gestione utenti
- `/api/admin/company/` - Gestione aziende

### **Allievi:**
- `/api/allievi/servizi/` - Prenotazioni e servizi
- `/api/allievi/istruzioni/` - Istruzioni patente

### **Dashboard:**
- `/api/dashboard/getEventsForCalendar` - Eventi calendario

---

## 🚨 PROBLEMI CRITICI

### **Sicurezza:**
- 100+ console.log in produzione
- Sentry DSN hardcoded
- Error handling inconsistente

### **Performance:**
- Next.js 13.1.6 (datato)
- React 18.2.0 (non latest)
- react-datepicker 4.6.0 (molto datato)

---

## 🔍 COLLEGAMENTI CRITICI

### **Sistema Permessi:**
- Rules → UsersCompanies → Company
- AccessCode → Page Routing → Layout

### **Sistema Prenotazioni:**
- Allievo → AllievoIstruzione → AllievoServizio
- Veicolo → Workplace → Company

### **Multi-Company:**
- User → UsersCompanies → Company
- ActiveCompany → Session → Layout

---

## 📋 PIANO AZIONE RAPIDO

### **FASE 1 (1-2 sett):**
- Rimuovere console.log
- Centralizzare error handling
- Rimuovere DSN hardcoded

### **FASE 2 (2-3 sett):**
- Aggiornare Next.js a 14+
- Aggiornare React a 18.3+
- Aggiornare react-datepicker

### **FASE 3 (4-6 sett):**
- Refactoring componenti
- TypeScript completo
- Testing

---

## ⚠️ REGOLE IMPORTANTI

### **Per Modifiche:**
1. **SEMPRE** controllare collegamenti tra componenti
2. **SEMPRE** verificare permessi e regole
3. **SEMPRE** testare su locale prima del deploy
4. **SEMPRE** controllare compatibilità multi-company

### **Per Debugging:**
1. Controllare log database
2. Verificare permessi utente
3. Controllare sessioni NextAuth
4. Verificare connessioni Prisma

---

## 📁 FILE CHIAVE

### **Config:**
- `next.config.js`, `tailwind.config.js`, `tsconfig.json`
- `package.json`, `prisma/schema.prisma`

### **Core:**
- `pages/_app.js`, `pages/index.js`
- `components/layout/layout.js`
- `store/notifications.js`, `store/modal.js`

### **Auth:**
- `pages/api/auth/[...nextauth].js`
- `lib/auth.js`, `lib/db.ts`

---

## ✅ STATO ATTUALE

**L'app è funzionalmente completa e ben strutturata, ma ha problemi di sicurezza e performance. L'architettura è solida e scalabile, ma necessita modernizzazione.**

**Sistema multi-company e permessi ben implementati. Componenti UI ben organizzati. Database schema robusto.**

---

**📞 USO: Riferimento rapido per modifiche future - Evita problemi di compatibilità!**
