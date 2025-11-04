# 🔍 ANALISI COMPLETA PROBLEMI FILTRO ISTRUTTORE

## 📋 INFORMAZIONI GENERALI
- **File Analizzato:** `pages/dashboard/index.js`
- **Problema:** Loop infinito quando si seleziona il filtro per ISTRUTTORE
- **Data Analisi:** Gennaio 2025
- **Priorità:** CRITICA

---

## 🚨 PROBLEMI IDENTIFICATI

### **1. PROBLEMA CRITICO: useEffect con Dipendenze Circolari (Riga 339-358)**

**Codice Problematico:**
```javascript
useEffect(() => {
    if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem('dashboard-savedFilters')
        if (saved && filtersSaved) {
            try {
                const parsedFilters = JSON.parse(saved)
                // Solo se i filtri attuali sono diversi da quelli salvati
                if (selectedIstruttore !== parsedFilters.selectedIstruttore) {
                    setSelectedFilter(parsedFilters.selectedFilter)
                    setSelectedWorkplace(parsedFilters.selectedWorkplace)
                    setSelectedIstruttore(parsedFilters.selectedIstruttore)  // ⚠️ MODIFICA selectedIstruttore
                    setSelectedInsegnante(parsedFilters.selectedInsegnante)
                    console.log('🔄 Filtri ripristinati da sessionStorage:', parsedFilters)
                }
            } catch (error) {
                console.warn('Errore nel ripristinare filtri da sessionStorage:', error)
            }
        }
    }
}, [filtersSaved, selectedIstruttore]);  // ⚠️ DIPENDE DA selectedIstruttore MA LO MODIFICA!
```

**Problema:**
- L'useEffect **dipende da `selectedIstruttore`** (riga 358)
- All'interno **modifica `selectedIstruttore`** (riga 349)
- Questo crea un **LOOP INFINITO**: quando cambia `selectedIstruttore`, l'useEffect si riattiva, che modifica `selectedIstruttore`, che riattiva l'useEffect, ecc.

**Causa del Loop:**
1. Utente seleziona istruttore → `selectedIstruttore` cambia
2. useEffect si attiva (perché dipende da `selectedIstruttore`)
3. useEffect legge sessionStorage e trova un valore diverso
4. useEffect modifica `selectedIstruttore` con `setSelectedIstruttore()`
5. `selectedIstruttore` cambia → torna al punto 2 → **LOOP INFINITO** 🔄

---

### **2. PROBLEMA: useSWR con Parametri Non Necessari (Riga 427-436)**

**Codice Problematico:**
```javascript
const { data: filteredListForSelectedBox } = useSWR(companyId ? {
    url: '/api/dashboard/getFilteredList',
    data: {
        companyId: companyId.isActive,
        selectedFilter: selectedFilter,
        selectedWorkplace: selectedWorkplace,
        selectedIstruttore: selectedIstruttore,  // ⚠️ NON NECESSARIO
        selectedInsegnante: selectedInsegnante,  // ⚠️ NON NECESSARIO
    }
} : null, fetcherWithData);
```

**Problema:**
- La chiamata API `/api/dashboard/getFilteredList` richiede solo `selectedFilter` e `companyId`
- Vengono passati anche `selectedWorkplace`, `selectedIstruttore`, `selectedInsegnante` che **non sono usati dall'API**
- Questo causa **chiamate API inutili** ogni volta che cambiano questi parametri
- Ogni cambio di `selectedIstruttore` **riattiva useSWR** → chiamata API → potenziale loop

**Verifica API:**
```javascript
// pages/api/dashboard/getFilteredList.js (riga 6)
const { companyId, selectedFilter } = req.body;
// ❌ NON usa selectedIstruttore, selectedInsegnante, selectedWorkplace
```

---

### **3. PROBLEMA: useEffect che Filtra Eventi (Riga 463-516)**

**Codice Problematico:**
```javascript
useEffect(() => {
    if (disponibilitaCalendar) {
        // ... logica filtri ...
        setEvents(arr);
    }
}, [disponibilitaCalendar, selectedFilter, selectedWorkplace, selectedIstruttore, selectedInsegnante])
```

**Problema:**
- Questo useEffect dipende da `selectedIstruttore`
- Quando `selectedIstruttore` cambia (per l'useEffect problematico sopra), questo si riattiva
- Se `disponibilitaCalendar` cambia contemporaneamente, può creare **race conditions**

---

### **4. PROBLEMA: setTimeout nei Componenti Notifiche**

**File Problema:**
- `components/UI/notifications/warning.js` (riga 12-16)
- `components/UI/notifications/success.js` (riga 12-16)
- `components/UI/notifications/error.js` (riga 12-16)

**Codice Problematico:**
```javascript
if (notifications.warning.show) {
    setTimeout(() => {
        notifications.warning.setShow(false)
    }, 4000)
}
```

**Problema:**
- `setTimeout` viene chiamato **direttamente nel render**, non in `useEffect`
- Ogni volta che il componente si renderizza e `show` è `true`, viene creato un **nuovo setTimeout**
- Nessuna pulizia dei timeout precedenti → **accumulo di timeout** → potenziali loop

---

## 🔗 CONCATENAZIONE DEI PROBLEMI

### **Flusso del Loop Infinito:**

```
1. Utente seleziona ISTRUTTORE nel filtro
   ↓
2. onChange chiama setSelectedIstruttore(value)
   ↓
3. selectedIstruttore cambia → useEffect (riga 339) si attiva
   ↓
4. useEffect legge sessionStorage e trova valore diverso
   ↓
5. useEffect chiama setSelectedIstruttore(parsedFilters.selectedIstruttore)
   ↓
6. selectedIstruttore cambia di nuovo → TORNA AL PASSO 3
   ↓
7. 🔄 LOOP INFINITO!
```

### **Problemi Collaterali:**

- **useSWR** (riga 427) si riattiva ad ogni cambio di `selectedIstruttore` → chiamate API multiple
- **useEffect filtri** (riga 463) si riattiva → rielaborazione eventi multipla
- **setTimeout notifiche** crea timeout multipli → possibili errori di timing

---

## ✅ SOLUZIONI PROPOSTE

### **SOLUZIONE 1: Correggere useEffect con Dipendenze Circolari**

**Problema:** useEffect dipende da `selectedIstruttore` ma lo modifica

**Soluzione:**
1. **Rimuovere `selectedIstruttore` dalle dipendenze**
2. **Usare un ref per tracciare se è il primo caricamento**
3. **Aggiungere controlli per evitare loop**

**Codice Corretto:**
```javascript
const isInitialLoad = useRef(true);

useEffect(() => {
    if (typeof window !== 'undefined' && isInitialLoad.current) {
        const saved = sessionStorage.getItem('dashboard-savedFilters')
        if (saved) {
            try {
                const parsedFilters = JSON.parse(saved)
                setSelectedFilter(parsedFilters.selectedFilter)
                setSelectedWorkplace(parsedFilters.selectedWorkplace)
                setSelectedIstruttore(parsedFilters.selectedIstruttore)
                setSelectedInsegnante(parsedFilters.selectedInsegnante)
                setFiltersSaved(true)
                console.log('🔄 Filtri caricati da sessionStorage:', parsedFilters)
            } catch (error) {
                console.warn('Errore nel caricare filtri da sessionStorage:', error)
            }
        }
        isInitialLoad.current = false;
    }
}, []); // ⚠️ SOLO AL CARICAMENTO INIZIALE
```

---

### **SOLUZIONE 2: Correggere useSWR - Rimuovere Parametri Non Necessari**

**Problema:** useSWR include parametri non usati dall'API

**Soluzione:**
```javascript
const { data: filteredListForSelectedBox } = useSWR(companyId ? {
    url: '/api/dashboard/getFilteredList',
    data: {
        companyId: companyId.isActive,
        selectedFilter: selectedFilter,  // ✅ SOLO QUESTO È NECESSARIO
    }
} : null, fetcherWithData);
```

---

### **SOLUZIONE 3: Correggere setTimeout nei Componenti Notifiche**

**Problema:** setTimeout chiamato nel render senza useEffect

**Soluzione:**
```javascript
useEffect(() => {
    if (notifications.warning.show) {
        const timer = setTimeout(() => {
            notifications.warning.setShow(false)
        }, 4000)
        
        // ⚠️ IMPORTANTE: pulizia timeout quando il componente si smonta o show cambia
        return () => clearTimeout(timer)
    }
}, [notifications.warning.show])
```

---

## 📊 IMPATTO DELLE CORREZIONI

### **Prima delle Correzioni:**
- ❌ Loop infinito quando si seleziona istruttore
- ❌ Chiamate API multiple e inutili
- ❌ Timeout multipli nelle notifiche
- ❌ Performance degradata
- ❌ Browser bloccato o lento

### **Dopo le Correzioni:**
- ✅ Nessun loop infinito
- ✅ Chiamate API ottimizzate
- ✅ Timeout gestiti correttamente
- ✅ Performance migliorata
- ✅ Browser fluido e reattivo

---

## 🧪 TEST DA ESEGUIRE

1. **Test Filtro Istruttore:**
   - Selezionare "Istruttore" dal filtro principale
   - Selezionare un istruttore specifico
   - Verificare che NON ci siano loop infiniti
   - Verificare che il calendario si aggiorni correttamente

2. **Test SessionStorage:**
   - Salvare filtri con "Salva Filtri"
   - Ricaricare la pagina
   - Verificare che i filtri vengano caricati correttamente
   - Verificare che NON ci siano loop infiniti

3. **Test Notifiche:**
   - Triggerare una notifica (success, error, warning)
   - Verificare che la notifica scompaia dopo 4 secondi
   - Verificare che NON ci siano timeout multipli

4. **Test Performance:**
   - Aprire DevTools → Network
   - Selezionare filtro istruttore
   - Verificare che ci sia SOLO UNA chiamata API
   - Verificare che NON ci siano chiamate multiple

---

## ⚠️ RISCHI

### **Rischi Bassa:**
- Cambiare la logica di caricamento filtri potrebbe rompere il salvataggio esistente
- **Mitigazione:** Testare con filtri salvati esistenti

### **Rischi Medi:**
- Rimuovere parametri da useSWR potrebbe causare problemi se l'API cambia in futuro
- **Mitigazione:** Verificare che l'API non usi quei parametri

### **Rischi Alta:**
- Nessun rischio alto identificato

---

## 📝 NOTE IMPORTANTI

1. **Backup:** Prima di modificare, fare backup del file `pages/dashboard/index.js`
2. **Test Incrementale:** Testare ogni correzione singolarmente
3. **SessionStorage:** Verificare che i filtri salvati continuino a funzionare
4. **Console Log:** Rimuovere console.log dopo i test

---

## ✅ CONCLUSIONI

**Problema Principale:** Loop infinito causato da useEffect con dipendenze circolari

**Soluzione Prioritaria:** Correggere useEffect (riga 339-358) rimuovendo `selectedIstruttore` dalle dipendenze

**Stato:** Pronto per correzione dopo conferma utente

---

**Data Creazione:** Gennaio 2025
**Priorità:** CRITICA
**Stato:** Analisi Completa

