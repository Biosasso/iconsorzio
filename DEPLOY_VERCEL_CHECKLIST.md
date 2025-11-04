# 🚀 CHECKLIST DEPLOY SU VERCEL

## ✅ MODIFICHE COMPLETATE

1. ✅ Correzione filtro istruttore - EMILIANO MARROCCO
2. ✅ Inizializzazione `selectedIstruttore` come stringa vuota
3. ✅ Filtro migliorato con controllo null-safe
4. ✅ Select controllato con `value` invece di `defaultValue`
5. ✅ Opzione vuota aggiunta
6. ✅ Conversione ID a stringhe per confronto sicuro
7. ✅ Correzione errore "Cannot read properties of null"

---

## 📋 CHECKLIST PRE-DEPLOY

### **1. Test Locale ✅**
- [x] Server avviato correttamente
- [x] Nessun errore di compilazione
- [x] Errori JavaScript corretti
- [ ] Test filtro EMILIANO MARROCCO funzionante
- [ ] Test altri istruttori funzionanti
- [ ] Test salvataggio filtri funzionante
- [ ] Nessun errore in console

### **2. Git Commit** ⚠️ IMPORTANTE
Prima di fare deploy, committare le modifiche:

```bash
# Verificare le modifiche
git status

# Aggiungere le modifiche
git add pages/dashboard/index.js
git add ANALISI_PROBLEMA_FILTRO_EMILIANO_MARROCCO.md
git add MODIFICHE_APPLICATE_FILTRO_ISTRUTTORE.md
git add TEST_FILTRO_ISTRUTTORE.md
git add DEPLOY_VERCEL_CHECKLIST.md

# Commit
git commit -m "fix: correzione filtro istruttore - risolto problema EMILIANO MARROCCO

- Inizializzato selectedIstruttore come stringa vuota invece di undefined
- Migliorato filtro con controllo null-safe e conversione ID a stringhe
- Cambiato select da defaultValue a value controllato
- Aggiunta opzione vuota 'Seleziona istruttore'
- Corretto errore 'Cannot read properties of null (reading profile)'
- Applicata stessa correzione anche al filtro insegnante per coerenza"
```

### **3. Verifica File Modificati**
- ✅ `pages/dashboard/index.js` - Modificato
- ✅ Documentazione - Aggiunta

### **4. Variabili d'Ambiente**
- [ ] Verificare che `.env.local` e `.env` siano configurati correttamente
- [ ] Verificare che le variabili d'ambiente siano impostate su Vercel

---

## 🚀 DEPLOY SU VERCEL

### **Opzione 1: Deploy Automatico (Git Integration)**
Se hai già configurato l'integrazione Git con Vercel:

```bash
# Push su Git
git push origin main
# o
git push origin master
```

Vercel farà automaticamente il deploy.

### **Opzione 2: Deploy Manuale (Vercel CLI)**
```bash
# Installare Vercel CLI (se non già installato)
npm i -g vercel

# Login (se non già fatto)
vercel login

# Deploy
vercel

# Deploy in produzione
vercel --prod
```

---

## ⚠️ IMPORTANTE - PRIMA DI DEPLOY

### **Test Finali da Fare:**

1. **Test Filtro EMILIANO MARROCCO:**
   - ✅ Selezionare "Istruttore" dal filtro
   - ✅ Selezionare "EMILIANO MARROCCO"
   - ✅ Verificare che il calendario mostri solo eventi di EMILIANO MARROCCO
   - ✅ Nessun errore in console

2. **Test Altri Istruttori:**
   - ✅ Selezionare altri istruttori
   - ✅ Verificare che funzionino tutti

3. **Test Console:**
   - ✅ Aprire DevTools → Console
   - ✅ Verificare nessun errore
   - ✅ Verificare nessun warning

4. **Test Salvataggio Filtri:**
   - ✅ Salvare filtri
   - ✅ Ricaricare pagina
   - ✅ Verificare che vengano ripristinati

---

## 🐛 SE QUALCOSA VA STORTO

### **Rollback Vercel:**
1. Vai su Vercel Dashboard
2. Seleziona il progetto
3. Vai su "Deployments"
4. Trova il deploy precedente funzionante
5. Clicca sui tre punti (...) → "Promote to Production"

### **Rollback Locale:**
```bash
# Tornare al commit precedente
git log  # Trova il commit hash precedente
git reset --hard <commit-hash>

# Oppure
git revert HEAD
```

---

## ✅ RISULTATI ATTESI DOPO DEPLOY

- ✅ Filtro EMILIANO MARROCCO funzionante
- ✅ Tutti gli istruttori funzionanti
- ✅ Nessun errore in console
- ✅ Salvataggio/caricamento filtri funzionante
- ✅ Nessun loop infinito

---

## 📝 NOTE

1. **Backup:** Le modifiche sono già nel codice locale
2. **Commit:** Fare sempre commit prima di deploy
3. **Test:** Testare sempre in locale prima di deploy
4. **Rollback:** Sapere sempre come fare rollback

---

**Stato:** Pronto per Deploy (dopo commit e test)
**Data:** Gennaio 2025

