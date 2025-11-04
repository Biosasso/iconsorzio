# 🔍 ANALISI PROBLEMA FILTRO ISTRUTTORE - EMILIANO MARROCCO

## 📋 INFORMAZIONI GENERALI
- **File Analizzato:** `pages/dashboard/index.js`
- **Problema:** Il filtro istruttore non funziona per "EMILIANO MARROCCO" (primo nominativo), ma funziona per gli altri
- **Data Analisi:** Gennaio 2025
- **Priorità:** MEDIA

---

## 🚨 PROBLEMI IDENTIFICATI

### **1. PROBLEMA: Inizializzazione `selectedIstruttore` come `undefined`**

**Codice Problematico (Riga 168):**
```javascript
const [selectedIstruttore, setSelectedIstruttore] = useState()
// ⚠️ Inizializzato come undefined invece di stringa vuota
```

**Problema:**
- Quando `selectedIstruttore` è `undefined`, il select non può selezionare correttamente il primo elemento
- Il confronto `undefined === id` fallisce sempre

---

### **2. PROBLEMA: Select usa `defaultValue` invece di `value` controllato**

**Codice Problematico (Riga 598):**
```javascript
<select
    id="istruttore"
    name="istruttore"
    defaultValue={selectedIstruttore}  // ⚠️ defaultValue non si aggiorna
    onChange={(e) => setSelectedIstruttore(e.target.value)}
>
```

**Problema:**
- `defaultValue` viene applicato solo al primo render
- Se `selectedIstruttore` cambia dopo, il select non si aggiorna
- Il primo elemento potrebbe non essere selezionato correttamente

---

### **3. PROBLEMA: Mismatch di tipo nel confronto (String vs Number)**

**Codice Problematico (Riga 492):**
```javascript
filteredArray = disponibilitaCalendar.filter(el => 
    el.istruttore?.profile?.id === selectedIstruttore
)
```

**Problema:**
- Il select HTML **restituisce sempre stringhe** (`e.target.value` è string)
- Gli ID nel database potrebbero essere **numeri** (se sono UUID o stringhe è ok, ma se sono integer no)
- Il confronto strict `===` fallisce se i tipi non corrispondono:
  - `"123" === 123` → `false` ❌
  - `"123" === "123"` → `true` ✅

**Esempio:**
- Se `el.istruttore.profile.id` è `123` (number)
- E `selectedIstruttore` è `"123"` (string dal select)
- Il confronto `123 === "123"` → `false` → l'elemento viene scartato ❌

---

### **4. PROBLEMA: Mancanza di controllo su `selectedIstruttore` vuoto**

**Codice Problematico (Riga 491-498):**
```javascript
else if (selectedFilter === 'istruttore') {
    filteredArray = disponibilitaCalendar.filter(el => 
        el.istruttore?.profile?.id === selectedIstruttore
    )
    // ⚠️ Non controlla se selectedIstruttore è vuoto/undefined
}
```

**Problema:**
- Se `selectedIstruttore` è `undefined` o `''`, il filtro viene eseguito comunque
- Questo potrebbe causare risultati inattesi per il primo elemento

---

## 🔍 ANALISI SPECIFICA PER "EMILIANO MARROCCO"

### **Ipotesi sul Problema:**

1. **EMILIANO MARROCCO è il primo elemento** nella lista `filteredListForSelectedBox`
2. Quando si seleziona il filtro "istruttore", `selectedIstruttore` è `undefined`
3. Il select mostra EMILIANO MARROCCO come primo elemento, ma non lo seleziona automaticamente
4. Quando l'utente seleziona manualmente EMILIANO MARROCCO:
   - Il select imposta `selectedIstruttore` come stringa (es: `"123"`)
   - Ma se l'ID nel database è un numero (es: `123`), il confronto `===` fallisce
   - Quindi il filtro non trova corrispondenze

### **Perché gli altri funzionano?**

- Gli altri istruttori potrebbero avere ID in formato diverso
- Oppure il problema si verifica solo per il primo elemento perché `selectedIstruttore` è `undefined` inizialmente

---

## ✅ SOLUZIONI PROPOSTE

### **SOLUZIONE 1: Inizializzare `selectedIstruttore` come stringa vuota**

**Cambiare:**
```javascript
const [selectedIstruttore, setSelectedIstruttore] = useState()
```

**In:**
```javascript
const [selectedIstruttore, setSelectedIstruttore] = useState('')
```

---

### **SOLUZIONE 2: Usare `value` controllato invece di `defaultValue`**

**Cambiare:**
```javascript
<select
    id="istruttore"
    name="istruttore"
    defaultValue={selectedIstruttore}
    onChange={(e) => setSelectedIstruttore(e.target.value)}
>
```

**In:**
```javascript
<select
    id="istruttore"
    name="istruttore"
    value={selectedIstruttore || ''}
    onChange={(e) => setSelectedIstruttore(e.target.value)}
>
```

---

### **SOLUZIONE 3: Convertire gli ID a stringhe nel confronto**

**Cambiare:**
```javascript
filteredArray = disponibilitaCalendar.filter(el => 
    el.istruttore?.profile?.id === selectedIstruttore
)
```

**In:**
```javascript
filteredArray = disponibilitaCalendar.filter(el => {
    if (!selectedIstruttore || selectedIstruttore === '') {
        return false; // Se non c'è selezione, non mostrare nulla
    }
    // Converti entrambi a stringhe per confronto sicuro
    const eventInstructorId = String(el.istruttore?.profile?.id || '');
    const selectedId = String(selectedIstruttore);
    return eventInstructorId === selectedId;
})
```

**Oppure più semplice:**
```javascript
filteredArray = disponibilitaCalendar.filter(el => {
    if (!selectedIstruttore) return false;
    return String(el.istruttore?.profile?.id || '') === String(selectedIstruttore);
})
```

---

### **SOLUZIONE 4: Aggiungere controllo su `selectedIstruttore` vuoto**

**Cambiare:**
```javascript
else if (selectedFilter === 'istruttore') {
    filteredArray = disponibilitaCalendar.filter(el => 
        el.istruttore?.profile?.id === selectedIstruttore
    )
}
```

**In:**
```javascript
else if (selectedFilter === 'istruttore' && selectedIstruttore) {
    filteredArray = disponibilitaCalendar.filter(el => {
        const eventInstructorId = String(el.istruttore?.profile?.id || '');
        const selectedId = String(selectedIstruttore);
        return eventInstructorId === selectedId;
    })
}
```

---

## 🔧 IMPLEMENTAZIONE COMPLETA

### **File: `pages/dashboard/index.js`**

**1. Correggere inizializzazione (Riga 168):**
```javascript
const [selectedIstruttore, setSelectedIstruttore] = useState('')  // ✅ Stringa vuota
```

**2. Correggere select (Riga 595-607):**
```javascript
<select
    id="istruttore"
    name="istruttore"
    value={selectedIstruttore || ''}  // ✅ value controllato
    onChange={(e) => setSelectedIstruttore(e.target.value)}
    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm capitalize"
>
    <option value="">Seleziona istruttore</option>  // ✅ Opzione vuota
    {filteredListForSelectedBox && filteredListForSelectedBox.length > 0 &&
        filteredListForSelectedBox.map((el) =>
            <option key={el.user.profile.id} value={String(el.user.profile.id)}>
                {el.user.profile.lastname} {el.user.profile.firstname}
            </option>
        )
    }
</select>
```

**3. Correggere filtro (Riga 491-498):**
```javascript
else if (selectedFilter === 'istruttore' && selectedIstruttore) {
    filteredArray = disponibilitaCalendar.filter(el => {
        if (!el.istruttore?.profile?.id) return false;
        return String(el.istruttore.profile.id) === String(selectedIstruttore);
    })
    // NON resettare i filtri se sono stati salvati in sessionStorage
    if (!filtersSaved) {
        setSelectedWorkplace('');
        setSelectedInsegnante('')
    }
}
```

---

## 🧪 TEST DA ESEGUIRE

1. **Test Filtro Istruttore - EMILIANO MARROCCO:**
   - Selezionare "Istruttore" dal filtro principale
   - Selezionare "EMILIANO MARROCCO" dal dropdown
   - ✅ Verificare che il calendario mostri SOLO gli eventi di EMILIANO MARROCCO
   - ✅ Verificare che gli eventi vengano filtrati correttamente

2. **Test Filtro Istruttore - Altri Istruttori:**
   - Selezionare altri istruttori dalla lista
   - ✅ Verificare che il filtro funzioni per tutti

3. **Test Reset Filtro:**
   - Selezionare un istruttore
   - Cambiare filtro a "Mostra tutti"
   - ✅ Verificare che tutti gli eventi vengano mostrati
   - ✅ Verificare che `selectedIstruttore` venga resettato

4. **Test Console:**
   - Aprire DevTools → Console
   - Selezionare istruttore
   - ✅ Verificare che non ci siano errori
   - ✅ Verificare che i valori siano corretti (log temporaneo)

---

## ⚠️ RISCHI

### **Rischi Bassa:**
- Cambiare `defaultValue` a `value` potrebbe causare problemi se ci sono altri componenti che modificano `selectedIstruttore`
- **Mitigazione:** Testare tutti i casi d'uso

### **Rischi Medi:**
- Convertire gli ID a stringhe potrebbe nascondere problemi di tipo esistenti
- **Mitigazione:** Verificare che gli ID nel database siano consistenti

### **Rischi Alta:**
- Nessun rischio alto identificato

---

## 📝 NOTE IMPORTANTI

1. **Backup:** Prima di modificare, fare backup del file `pages/dashboard/index.js`
2. **Test Incrementale:** Testare ogni modifica singolarmente
3. **Console Log:** Aggiungere log temporanei per debug:
   ```javascript
   console.log('DEBUG Filtro:', {
       selectedIstruttore,
       tipo: typeof selectedIstruttore,
       primoElemento: filteredListForSelectedBox?.[0]?.user?.profile?.id,
       tipoPrimo: typeof filteredListForSelectedBox?.[0]?.user?.profile?.id
   })
   ```

---

## ✅ CONCLUSIONI

**Problema Principale:** Mismatch di tipo nel confronto + `defaultValue` invece di `value` controllato

**Soluzione Prioritaria:** 
1. Inizializzare `selectedIstruttore` come stringa vuota
2. Usare `value` controllato nel select
3. Convertire entrambi gli ID a stringhe nel confronto

**Stato:** Pronto per correzione dopo conferma utente

---

**Data Creazione:** Gennaio 2025
**Priorità:** MEDIA
**Stato:** Analisi Completa

