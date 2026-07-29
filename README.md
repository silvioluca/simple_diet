# Simple Diet

Web app (PWA installabile) per tracciare **calorie, proteine, carboidrati e grassi**
giorno per giorno, più ricette, piano alimentare settimanale e misure corporee.

- **Zero build step** — HTML + CSS + JavaScript ES module serviti così come sono.
- **Firebase** — Auth con Google (accesso limitato a email autorizzate) + Firestore.
- **Ricerca alimenti** — tabella locale di alimenti sfusi + Open Food Facts per i confezionati.
- **Mobile / iPad first** — nav a schede in basso su telefono, colonna laterale su iPad,
  safe-area insets, swipe orizzontale per cambiare giorno, tema chiaro e scuro.

## Sezioni

| Sezione | Contenuto |
|---|---|
| **Dashboard** | Anello calorie rimanenti, barre macro, stat card (assunte, media 7 gg, peso, variazione 30 gg), avvisi automatici, grafici kcal e macro a 14 giorni, ripartizione calorica del giorno, trend peso |
| **Pasti** | Diario per 6 slot (colazione → dopo cena). Pulsante `+` flottante che indovina il pasto dall'ora. Ricerca unificata, barcode, inserimento manuale, import del piano del giorno |
| **Ricette** | Due pannelli. *Le mie ricette*: ingredienti + porzioni → kcal e macro per porzione, riutilizzabili nei suggerimenti. *Idee*: 51 ricette dietetiche pronte, filtrabili per ingrediente e per tipo, da aggiungere al diario regolando la grammatura |
| **Dieta** | Obiettivi automatici (da TDEE) o manuali, piano settimanale per giorno, copia su altri giorni, import/export del piano |
| **Misure** | Peso, massa grassa, petto, vita, fianchi, braccio, coscia, collo. BMI, rapporto vita/fianchi, delta 7 e 30 giorni, grafico per metrica, storico |
| **Profilo** (topbar) | Dati personali (BMR Mifflin-St Jeor → TDEE), account Google, uscita |

## Ricerca alimenti

Tre sorgenti, interrogate insieme:

1. **Ricette dell'utente** — locali, immediate.
2. **[Tabella alimenti base](public/js/data/foods-base.js)** — 617 voci in 18 categorie:
   frutta, verdura, carne, pesce, latticini, cereali, legumi, frutta secca, condimenti,
   dolci, bevande, spezie, integratori **e piatti composti** (pasta al ragù, lasagne,
   risotto, parmigiana, minestrone, fast food…). Valori per 100 g da tabelle di
   composizione CREA/USDA. Locale: istantanea, funziona offline, nessun rate limit.
3. **Open Food Facts** — prodotti confezionati con codice a barre.

Le prime due rispondono sempre. Open Food Facts risponde spesso `503` sulla ricerca
full-text (limite di ~10 richieste al minuto per IP; l'host mondiale è quasi sempre
sovraccarico e l'endpoint `search.openfoodfacts.org` non esiste più): quando succede i
risultati locali restano visibili e compare un avviso discreto, invece di far fallire
tutta la ricerca.

## Idee ricette

[recipe-ideas.js](public/js/data/recipe-ideas.js) contiene 51 ricette dietetiche italiane
con grammature esatte. **Gli ingredienti citano i nomi della tabella alimenti e le macro
non sono duplicate**: vengono calcolate da lì, quindi non possono divergere. Un test
verifica che ogni ingrediente sia risolvibile.

Perché una collezione locale e non un sito:

| Fonte | Perché no |
|---|---|
| TheMealDB | Nessun dato nutrizionale; quantità in testo libero ("1 cup") → macro non calcolabili |
| Spoonacular, Edamam | Richiedono una API key, che nel JS di una PWA sarebbe pubblica; quota sul piano gratuito |
| Siti di ricette | CORS chiuso: il browser non può leggerli |

La ricerca copre nome, ingredienti e tag, quindi i filtri restano pochi: sei tagli
rapidi (proteica, vegetariana, vegana, low carb, veloce, meal prep). Aprendo una scheda
si vedono ingredienti, procedimento e macro; la si aggiunge al diario scegliendo il pasto
e regolando i grammi, con scorciatoie da ½ a 2 porzioni.

### Copertine e foto

Ogni idea ha una **copertina generata**: emoji del piatto su un gradiente che indica il
momento del pasto (colazione arancio, pranzo blu, cena viola, contorno verde).

Sopra può esserci una **foto vera**. Le foto non si scaricano a runtime: si risolvono una
volta sola con [scripts/fetch-pexels.mjs](scripts/fetch-pexels.mjs) e finiscono in
`IDEA_PHOTOS` dentro [recipe-ideas.js](public/js/data/recipe-ideas.js). Così la chiave API
non entra mai nel codice servito al browser e non c'è nessuna chiamata di rete in più.

```bash
PEXELS_API_KEY=la_tua_chiave node scripts/fetch-pexels.mjs        # risolve e scrive
PEXELS_API_KEY=la_tua_chiave node scripts/fetch-pexels.mjs --dry  # solo anteprima
```

Chiave gratuita su [pexels.com/api](https://www.pexels.com/api/), senza carta di credito.
Lo script è rilanciabile: riscrive il blocco senza toccare il resto del file.

Se una foto manca o smette di rispondere, l'immagine viene rimossa e riaffiora la
copertina generata: nessun riquadro rotto.

Le ricette create dall'utente non passano da Pexels — servirebbe la chiave nel browser.
Hanno una **copertina dedotta automaticamente**: emoji della categoria dell'ingrediente
che pesa di più (ignorando olio e spezie, presenti quasi ovunque) e colore stabile
derivato dal nome. In alternativa si incolla l'indirizzo di un'immagine nell'editor.

**Perché non Google Immagini:** non esiste un'API pubblica. Lo scraping è bloccato da CORS
e vietato dai termini d'uso; *Custom Search JSON API* richiede una chiave che nel JS di
una PWA sarebbe pubblica, ha 100 query al giorno gratis e restituisce hotlink a immagini
protette di siti terzi. Le fonti CC senza chiave (Openverse, Wikimedia) sono state
provate: su 51 piatti ne risolvono 24 e la metà sono immagini sbagliate.

## Import del piano settimanale

**Dieta → Importa** accetta CSV, JSON o testo incollato. Una riga per alimento:

```
giorno, pasto, alimento, grammi [, kcal_100g, proteine_100g, carboidrati_100g, grassi_100g]
```

Le colonne nutrizionali sono facoltative: se mancano, i valori vengono cercati per nome
nella tabella alimenti base. Giorni e pasti sono riconosciuti anche abbreviati
(`lun`, `martedi`, `merenda`…) e i separatori ammessi sono `,` `;` `|` e tab.
**Scarica modello CSV** genera un file di esempio già compilato.

> Da un sito web: seleziona la tabella, copiala e incollala. Il browser **non** può
> scaricare direttamente pagine di altri domini — la Same-Origin Policy lo impedisce
> e nessun sito di diete abilita CORS.

## Setup

### 1. Progetto Firebase

1. [console.firebase.google.com](https://console.firebase.google.com) → **Aggiungi progetto**.
2. **Build → Authentication → Sign-in method → Google**: abilita.
3. **Build → Firestore Database → Crea database** in modalità produzione.
4. **Impostazioni progetto → Le tue app → Web (`</>`)**: registra l'app e copia `firebaseConfig`.

### 2. Configurazione

In [public/js/config.js](public/js/config.js): incolla `firebaseConfig` e metti le email
autorizzate in `ALLOWED_EMAILS`.

**Le stesse email vanno replicate nelle regole Firestore**: `config.js` nasconde solo
l'interfaccia, le regole sono ciò che protegge davvero i dati. Regole minime:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function allowed() {
      return request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email in ['tua@email.com'];
    }
    match /users/{uid} {
      allow read, write: if allowed() && request.auth.uid == uid;
      match /{sub=**} { allow read, write: if allowed() && request.auth.uid == uid; }
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

> La chiave `apiKey` in `config.js` è pubblica per design in Firebase web: non è un
> segreto ed è corretto committarla. La protezione sono le regole.

### 3. Sviluppo locale

```bash
node dev-server.mjs        # http://localhost:5000, nessuna dipendenza
```

Oppure, con firebase-tools installato:

```bash
npm install -g firebase-tools
firebase login
firebase serve
```

> Aprire `index.html` da file system **non** funziona: gli ES module richiedono `http://`.

### 4. Deploy su GitHub Pages

Il workflow [.github/workflows/pages.yml](.github/workflows/pages.yml) pubblica `public/`
a ogni push su `main`. Da abilitare una volta sola:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**
2. **Console Firebase → Authentication → Settings → Authorized domains → Aggiungi dominio**:
   `silvioluca.github.io` — senza questo il login con Google viene rifiutato.
3. **Console Firebase → Firestore → Regole**: incolla [firestore.rules](firestore.rules)
   e pubblica.

Il sito esce su `https://<utente>.github.io/<repo>/`, cioè in una **sottocartella**: per
questo tutti i percorsi dell'app sono relativi (`css/style.css`, non `/css/style.css`) e
il manifest usa `"scope": "./"`. Funziona identico servito dalla radice.

> ⚠️ Un sito su GitHub Pages è **pubblico**. `apiKey` e `projectId` Firebase sono nel
> JavaScript e quindi visibili: `ALLOWED_EMAILS` in `config.js` nasconde solo l'interfaccia.
> Le regole Firestore sono l'unica cosa che protegge davvero i dati. Pubblicale prima
> di rendere raggiungibile il sito.

### 5. Deploy su Firebase Hosting

```bash
firebase deploy
```

`firebase.json` referenzia `firestore.rules` e `firestore.indexes.json`: entrambi devono
esistere, altrimenti il deploy fallisce.

## Struttura dati Firestore

```
users/{uid}
  profile  { sex, birthDate, heightCm, weightKg, activity, goal, proteinPerKg, fatPercent }
  targets  { kcal, protein, carbs, fat, auto }
  plan     { "1".."7": [ { slot, name, grams, per100 } ] }     // 1 = lunedì

users/{uid}/entries/{id}
  { date: "YYYY-MM-DD", slot, name, brand, code, grams,
    per100: { kcal, protein, carbs, fat },
    totals: { kcal, protein, carbs, fat }, createdAt }

users/{uid}/recipes/{id}
  { name, servings, ingredients: [ { name, grams, per100 } ],
    totalGrams, totals, per100, updatedAt }

users/{uid}/measures/{YYYY-MM-DD}
  { date, weight, bodyFat, chest, waist, hips, arm, thigh, neck, note, updatedAt }

users/{uid}/foods/{barcode|slug}
  { name, brand, code, image, servingG, per100, lastUsed }     // alimenti recenti
```

Serve un indice composto su `entries` (`date` + `createdAt`): è dichiarato in
[firestore.indexes.json](firestore.indexes.json) e viene creato da `firebase deploy`,
oppure dal link che Firestore stampa in console al primo utilizzo.

## Note

- Ogni account Google ha il proprio `users/{uid}`: i diari sono **separati**, non condivisi.
- I valori di Open Food Facts vengono dalle etichette caricate dagli utenti: possono
  mancare o essere errati. I prodotti senza dati nutrizionali sono filtrati dai risultati.
- La tabella alimenti base riporta valori medi: variano con varietà, taglio e cottura.
  `(c)` = crudo, `(k)` = cotto.
- La scansione del barcode dalla fotocamera non è disponibile: Safari non implementa
  `BarcodeDetector`. Il codice si inserisce a mano.
- Il calcolo del fabbisogno è una stima statistica, non un parere medico.
