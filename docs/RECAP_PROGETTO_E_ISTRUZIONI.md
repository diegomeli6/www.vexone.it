# VEX ONE — Documento di Recap Completo & Registro Istruzioni

Questo documento raccoglie **tutte le istruzioni, le direttive, le decisioni tecniche e le modifiche grafiche/funzionali** concordate ed eseguite sul progetto **VEX ONE**.  
Rappresenta la guida di riferimento ufficiale per comprendere lo stato attuale del sito e guidare con precisione tutti i prossimi sviluppi.

---

## INDICE
1. [Stato dei Dati Sensibili & Sicurezza del Sito Online](#1-stato-dei-dati-sensibili--sicurezza-del-sito-online)
2. [Tecnologia Utilizzata (HTML/CSS/JS vs Python)](#2-tecnologia-utilizzata-htmlcssjs-vs-python)
3. [Cronologia Completa delle Istruzioni date dall'Utente](#3-cronologia-completa-delle-istruzioni-date-dallutente)
4. [Mappa del Sito e Stato delle Pagine](#4-mappa-del-sito-e-stato-delle-pagine)
5. [Dettaglio Modifiche Eseguite (Nuova Spedizione & Admin)](#5-dettaglio-modifiche-eseguite-nuova-spedizione--admin)
6. [Roadmap dei Prossimi Passi (Dashboard, Tracking, Portafoglio)](#6-roadmap-dei-prossimi-passi-dashboard-tracking-portafoglio)

---

## 1. Stato dei Dati Sensibili & Sicurezza del Sito Online

* **Il sito attualmente online NON è toccato**:  
  Tutto il lavoro di sviluppo e restyling avviene **esclusivamente in locale** all'interno della cartella dedicata:
  `/Users/diego/Desktop/www.vexone.it/vexone_remake/`.  
  Nessun file presente sul server di produzione o sul dominio pubblico è stato modificato o compromesso.
* **Backup di sicurezza**:  
  È presente un backup completo dei file originali nella cartella `_vecchio_sito_next/`.
* **Nessun rischio di fughe dati**:  
  Il server locale aperto (`http://localhost:3333/`) è visibile solo sul computer di sviluppo (`127.0.0.1`). I dati inseriti nei form sono salvati unicamente nel browser locale (`localStorage` e `sessionStorage`).
* **Avviso Google Chrome "Password compromessa"**:  
  L'avviso comparso durante i test nei campi password era dovuto al fatto che l'assistente aveva digitato una password di prova generica (es. `password123`). Google Chrome segnala automaticamente queste stringhe note perché presenti nei dizionari pubblici di password violate; non ha alcuna correlazione con la sicurezza del codice o degli account reali.

---

## 2. Tecnologia Utilizzata (HTML/CSS/JS vs Python)

* **Nessun codice Python nel sito**:  
  L'utente aveva chiesto se per modificare il sito o collegare i dati servisse toccare file Python.
  È stato chiarito che:
  * L'applicazione front-end è realizzata al **100% in HTML5 semantico, CSS3 (Tailwind CSS + fogli di stile personalizzati) e JavaScript moderno nativo (Vanilla JS)**.
  * Python è stato utilizzato **solo** ed esclusivamente per avviare il piccolo server di prova locale tramite terminale (`python3 -m http.server 3333`).
  * Non ci sono dipendenze da compilare o configurazioni server complesse per visualizzare le modifiche grafiche e i flussi.

---

## 3. Cronologia Completa delle Istruzioni date dall'Utente

| # | Richiesta / Istruzione dell'Utente | Azione Eseguita & Risultato |
|---|---|---|
| **1** | Chiarimento su sicurezza, sito online e gestione dati sensibili. | Confermato che lavoriamo in locale protetto, senza toccare il dominio online. |
| **2** | Segnalazione bug: il tasto *"⚡ Usa i miei dati"* non compilava tutti i campi (disallineamento dati). | Risolto il bug: mappatura dinamica sia per **Privato** (nome, cognome, via, num, cap, città, pr, tel, mail) sia per **Azienda** (ragione sociale, p.iva/cf, referente, ecc.). |
| **3** | Valutare il flusso del sito per eliminare confusione e troppi elementi sparsi. | Riordinata la struttura logica del flusso: Homepage $\rightarrow$ Comparatore $\rightarrow$ Checkout $\rightarrow$ Dashboard. |
| **4** | Lavorare all'interno della cartella del progetto tenendo un backup e separando i file. | Creata la cartella isolata `vexone_remake/` con tutti gli asset e i backup dedicati. |
| **5** | Chiarire se per il tasto dati e il flusso si tocca prima HTML/CSS o Python. | Spiegato che il flusso e la logica sono interamente in HTML, CSS e JavaScript; nessun codice Python necessario. |
| **6** | Audit delle pagine mancanti nel restyling (es. pagina di login mancante) e controllo admin. | Rilevata l'assenza delle pagine di autenticazione (`login.html`, `register.html`, `recupero-password.html`) e ispezionato `admin.html`. |
| **7** | Creazione pagine mancanti e uniformazione grafica admin (sidebar chiara per test). | Create `login.html`, `register.html`, `recupero-password.html`. Testata la sidebar chiara in admin. |
| **8** | Dopo il controllo, **ripristinare la pagina admin con sidebar scura originale**. | Ripristinata la sidebar di `admin.html` e `admin.css` con sfondo `#0A0A0B`, logo originale `logo.svg` e testi chiari. |
| **9** | **Tasto "Usa i miei dati"**: renderlo trasparente, con avvisi espliciti se mancano dati privati o aziendali. | Aggiunti toast di avviso con focus automatico sul campo mancante se l'utente è in modalità Azienda ma non ha salvato una P.IVA, o se è in Privato senza nome. |
| **10** | **Form scorrevoli a step (non in colonna)**: un passaggio alla volta con navigazione a slide. | Sostituita la lunga colonna impilata con un **container a slide orizzontali**: Step 1 (Mittente) $\rightarrow$ Step 2 (Destinatario) $\rightarrow$ Step 3 (Opzioni) con tasti *"Continua"* e *"Indietro"*. |
| **11** | **3 Numerini uniformi**: non colori diversi (no arancione/verde spaiati), tutti dello stesso stile, semi-opachi e pieni a step completato. | Numerini uniformati: cerchietti neutri al 45% di opacità quando inattivi, blu pieno al 100% quando attivi e completati. |
| **12** | **Sezione colli da spedire**: eliminare il riquadro vuoto a sinistra e mostrare un vero resoconto dei pacchi prima della scelta del corriere. | Sostituito il riquadro vuoto con un'icona vettoriale di un pacco 3D; aggiunto il **resoconto dettagliato di ogni collo (peso, dimensioni L×W×H e peso volumetrico)** sempre visibile nella card. |
| **13** | **Card corrieri più compatte**: togliere il vuoto superfluo, ridurre l'altezza. | Card corrieri riprogettate con altezza ridotta, padding ottimizzato (12px 18px) ed eliminazione dello spazio vuoto. |
| **14** | **Niente banner luminosi giganti**: usare icone vettoriali discrete a destra delle scritte (fulmine, soldi, stella). | Eliminato il banner vistoso superiore; inseriti badge con icone discrete a destra del nome: ⚡ *Più Veloce / 24h*, 💰 *Più Economico*, ⭐ *Consigliato*. |
| **15** | **Distanza tra prezzo e tasto "Scegli"**: dare spazio e respiro per non farli accavallare. | Creata la struttura `.price-action-group` con 20px di margine fisso tra blocco prezzo e pulsante. |
| **16** | **Loghi vettoriali originali dei corrieri** (non riquadri colorati con lettere). | Generati e integrati gli SVG ufficiali ad alta risoluzione per: **BRT**, **DHL Express**, **FedEx Priority**, **GLS**, **UPS**, **Poste / SDA**, **TNT**, **InPost**. |

---

## 4. Mappa del Sito e Stato delle Pagine

Tutti i file sono fruibili all'indirizzo locale: `http://localhost:3333/[nome-file]`

```
vexone_remake/
│
├── index.html                  [COMPLETA]  Landing page con tariffe, servizi, FAQ e tasti Accedi/Registrati collegati
├── comparatore.html            [COMPLETA]  Nuova Spedizione: stepper a slide, resoconto colli, loghi vettoriali corrieri
├── checkout.html               [COMPLETA]  Riepilogo finale, pagamento, note corriere e integrazione sessione
├── dashboard.html              [DA RIFINIRE] Dashboard utente: spedizioni attive, grafici e saldo
├── tracking.html               [DA RIFINIRE] Ricerca e timeline stato spedizioni
├── portafoglio.html            [DA RIFINIRE] Ricarica credito, transazioni, fatture
├── assistenza.html             [COMPLETA]  Centro assistenza e supporto clienti
│
├── login.html                  [COMPLETA]  Accesso: split banner brand + form autenticazione
├── register.html               [COMPLETA]  Registrazione: switcher Privato / Azienda con salvataggio profilo
├── recupero-password.html      [COMPLETA]  Reset password con notifica invio link
│
├── admin.html                  [COMPLETA]  Pannello Admin con sidebar scura originale ripristinata
│
└── assets/
    ├── css/pages/comparatore.css  (Stili stepper a slide, 3 numerini uniformi, card corrieri compatte)
    ├── css/pages/admin.css        (Stili admin panel con sidebar scura)
    ├── logos/carriers/*.svg       (Loghi ufficiali: BRT, DHL, FedEx, GLS, UPS, SDA, TNT, InPost)
    └── js/tailwind-config.js      (Configurazione colori brand VEX ONE)
```

---

## 5. Dettaglio Modifiche Eseguite (Nuova Spedizione & Admin)

### A. Nuova Spedizione ([comparatore.html](file:///Users/diego/Desktop/www.vexone.it/vexone_remake/comparatore.html))
1. **Stepper Scorrevole Orizzontale (Slide)**:
   * **Slide 1**: *Da dove parte la spedizione? (Mittente)* con switcher Privato/Azienda, tasto dati e pulsante *"Continua: Destinatario →"*.
   * **Slide 2**: *A chi deve essere consegnato? (Destinatario)* con rubrica e pulsanti *"← Indietro (Mittente)"* e *"Continua: Opzioni →"*.
   * **Slide 3**: *Opzioni di ritiro e note* con selezione Domicilio vs Hub e pulsante per focalizzarsi sui corrieri.
2. **I 3 Numerini Uniformi**:
   * Tutti con lo stesso cerchietto e font.
   * Semi-opachi (45%) quando non attivi; quando lo step è selezionato o completato diventano pieni al 100% in blu vivo.
3. **Card "Pacchi da spedire"**:
   * Eliminato il quadrato vuoto grigio; inserita icona pacco vettoriale 3D (`📦`).
   * Resoconto dettagliato visibile prima della selezione corriere: peso per singolo collo, dimensioni (L × W × H) e avviso su peso volumetrico se applicabile.
4. **Card Corrieri**:
   * Altezza ridotta e design compatto (nessun vuoto sprecato).
   * Loghi vettoriali ufficiali originali (DHL con sfondo giallo e strisce rosse, FedEx viola e arancio, BRT rosso, GLS blu, ecc.).
   * Icone discrete a destra del titolo: `⚡ 24h / Più Veloce`, `💰 Più Economico`, `⭐ Consigliato`.
   * Prezzo e pulsante separati con 20px di spazio.

### B. Admin Panel ([admin.html](file:///Users/diego/Desktop/www.vexone.it/vexone_remake/admin.html))
* **Sidebar ripristinata scura**:
  * Sfondo `#0A0A0B`, bordo `1px solid rgba(255,255,255,0.08)`.
  * Logo bianco `assets/logos/logo.svg` con badge lime `ADMIN PANEL`.
  * Voci di menu in grigio neutro con evidenziazione azzurra sulla sezione attiva.

---

## 6. Roadmap dei Prossimi Passi (Dashboard, Tracking, Portafoglio)

Seguendo l'ordine indicato dall'utente, i prossimi interventi grafici e di flusso saranno:

1. **Dashboard Utente ([dashboard.html](file:///Users/diego/Desktop/www.vexone.it/vexone_remake/dashboard.html))**:
   * Revisione del layout delle card metriche (spedizioni in transito, consegnate, giacenze, saldo portafoglio).
   * Tabella delle ultime spedizioni con badge di stato chiari e azioni veloci (Dettagli, Tracking, Ristampa LDV).
   * Uniformazione dei colori al nuovo stile pulito con accenti blu e lime.

2. **Tracking ([tracking.html](file:///Users/diego/Desktop/www.vexone.it/vexone_remake/tracking.html))**:
   * Timeline verticale pulita delle tappe del corriere con icone per ogni stato (Preso in carico, In transito, In consegna, Consegnato).
   * Mappa o visualizzazione geografica semplificata.
   * Dati del corriere effettivo (logo SVG del corriere e codice LDV).

3. **Portafoglio & Fatturazione ([portafoglio.html](file:///Users/diego/Desktop/www.vexone.it/vexone_remake/portafoglio.html))**:
   * Card saldo principale con tasto rapido di ricarica (+€25, +€50, +€100).
   * Storico transazioni con filtri (Ricariche, Pagamenti spedizioni, Rimborsi).
   * Sezione fatture elettroniche scaricabili in PDF/XML.
