# VEX ONE — Documento di Recap & Linee Guida per Nuova Sessione

> **Scopo di questo documento**: questo file contiene la sintesi completa di tutte le istruzioni, scelte grafiche, regole di design e architettura tecnica definite finora per il progetto **VEX ONE**. Può essere copiato e incollato all'avvio di una nuova chat per consentire all'IA di riprendere il lavoro con continuità assoluta e senza perdere alcuna impostazione.

---

## 1. Prompt Rapido per Nuova Chat (Copia & Incolla)

```text
Ciao! Continuiamo il lavoro di rifinitura grafica e sviluppo per il sito web VEX ONE.
Ho creato il file RECAP_PROGETTO.md nella root del workspace: leggilo attentamente prima di procedere.
Rispetta rigorosamente:
1. Palette colori minimale (nessun gradiente o colore arcobaleno non giustificato).
2. Tipografia Inter (pesi standard 400, 500, 600, 700; niente corsivi o testi compressi a 10px).
3. Zero emoji: solo icone SVG pulite e funzionanti.
4. Navbar universale post-login identica su tutte le pagine (comparatore, dashboard, tracking, portafoglio, impostazioni) con notifiche, saldo e utente a mezzo busto con altezza unificata a 42px. Nessun toggle giorno/notte.
5. Respiro e margini: container universale .app-page-container (max-w-[1240px]) e .page-header unificato.
6. Nessuna duplicazione di funzioni tra header e sezioni.
```

---

## 2. Direttive e Regole Fondamentali dell'Utente

### A. Pulizia, Coerenza & "Aspetto Reale" (No Finto)
- **Bordi**: mai esageratamente arrotondati (no a pillole `9999px` ovunque). Si utilizzano raggi discreti: `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (16px).
- **Zero Emoji**: **vietate le emoji**. Tutte le vecchie emoji sono state rimosse e sostituite con icone SVG pulite (Lucide/Feather style).
- **Nessun riquadro o box orfano**: rimossi tutti i vecchi contenitori quadrati/rettangolari colorati che prima racchiudevano le emoji.
- **Tipografia**:
  - Utilizzare **solo il font Google `Inter`** con pesi controllati: `400` (Regular), `500` (Medium), `600` (Semi-Bold), `700` (Bold).
  - Rimossi i font secondari, i corsivi non giustificati e i pesi estremi (es. 800/900).
  - Vietati i testi minuscoli compressi (`text-[10px]` o `text-[11px]` tutti in maiuscolo con spaziatura estrema). Standardizzati su `12px` (meta/badge) e `14px` (lettura).
- **Palette Colori Essenziale e Rigorosa**:
  - Sfondo neutro rilassante: `#F8F9FA` / `#F4F5F7`.
  - Superfici card: `#FFFFFF`, bordo `1px solid #E5E7EB`, ombra morbida `0 1px 3px rgba(0,0,0,0.04)`.
  - Testo scuro primario: `#0A0A0B` (mai nero puro abbagliante).
  - Testo secondario: `#4B5563`; testo attenuato/meta: `#6B7280`.
  - **Blu Brand (`#0078FF`)**: per azioni primarie, link attivi, focus ring e indicatori.
  - **Lime Brand (`#B8FF00`)**: accenti speciali, badge energici (usato con parsimonia).
  - **Verde Monetario / Consegna (`#16A34A`)**: esclusivo per credito residuo, risparmio e stato "Consegnato".
  - **Ambra (`#D97706`)**: per stato "In Transito", ritiri imminenti e avvisi operativi.
  - **Rosso (`#DC2626`)**: solo per anomalie o azioni distruttive.
  - **Divieto**: nessun gradiente casuale, sfumature neon, blob `filter: blur(90px)` o colori estranei.

---

## 3. Architettura della Navbar

### Navbar Pre-Login (`index.html`)
- **Stile Chiaro**: sfondo bianco opaco (`rgba(255, 255, 255, 0.95)`) con bordo `#E5E7EB`.
- **Logo**: logo scuro `assets/logos/logo-dark.svg` a sinistra.
- **Link "Tariffe"**: **deve essere un'ancora interna** (`href="#tariffe"`) con scroll fluido verso la sezione calcolatore risparmio (`id="tariffe"`). Non deve portare al comparatore.
- **Pulsanti a Destra**: "Accedi" (secondario, bordo neutro) e "Inizia Gratis" (primario lime).

### Navbar Post-Login Universale (Identica al 100% su Tutte le Pagine)
Presente su: `comparatore.html`, `dashboard.html`, `tracking.html`, `portafoglio.html`, `impostazioni.html`.
Tutti gli stili sono centralizzati in `assets/css/main.css` e la logica in `assets/js/nav-user.js`.

1. **Logo**: `assets/logos/logo-dark.svg` (altezza 28px).
2. **4 Voci Centrali**: Nuova Spedizione, Dashboard, Tracking, Portafoglio (con classe `.active` sulla pagina corrente).
3. **Pulsante Notifiche (`.notif-btn`)**:
   - Bottone circolare grigio chiaro `#F3F4F6` con bordo `#E5E7EB`.
   - Badge notifiche non lette (`3`) in blu `#0078FF`.
   - Dropdown panel interattivo (`.notif-panel`) con elenco notifiche, "Segna lette" e link al tracking.
   - Chiusura automatica al click esterno (click-outside) e alla pressione del tasto `Esc`.
4. **Pulsante Giorno/Notte (Dark Mode Toggle)**: **COMPLETAMENTE RIMOSSO** da tutte le pagine.
5. **Pillola Saldo (`.nav-wallet-pill`)**:
   - Sempre visibile a destra, sfondo verde chiarissimo `#F0FDF4`, bordo verde `#BBF7D0`, testo `#15803D`.
   - Icona portafoglio SVG, importo `€ 124,50` e badge circolare `+` per ricarica rapida.
   - Link diretto a `portafoglio.html`.
6. **Tasto Utente (`.nav-user-chip`)**:
   - **Icona Silhouette a Mezzo Busto** in SVG (rimosse le iniziali "DA").
   - Info utente: piano `VEX Pro` (grigio) e nome `Damiano Arcidiacono` (scuro).
   - Freccia chevron SVG rotante all'apertura del menu.
   - Dropdown menu con collegamenti rapidi e pulsante "Disconnetti".
7. **Regola Geometrica delle Altezze**:
   - `.notif-btn`, `.nav-wallet-pill` e `.nav-user-chip` hanno **tutti e tre l'altezza fissa di 42px** (`box-sizing: border-box`). Sono perfettamente allineati lungo la stessa linea d'asse.

---

## 4. Spaziature, Margini e "Respiro" Visivo

### Margini Laterali (`.app-page-container`)
- Nessuna pagina post-login deve mai estendersi fino ai bordi dello schermo (rimosso il vecchio `max-w-[1560px]` che toccava i bordi).
- **Container standard**:
  ```css
  .app-page-container {
    max-width: 1240px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 36px;
    padding-bottom: 80px;
  }
  @media (min-width: 640px) {
    .app-page-container { padding-left: 32px; padding-right: 32px; }
  }
  @media (min-width: 1024px) {
    .app-page-container { padding-left: 48px; padding-right: 48px; padding-top: 44px; padding-bottom: 96px; }
  }
  ```

### Header di Pagina Unificato (`.page-header`)
Struttura standard presente su tutte le pagine:
```html
<header class="page-header">
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div class="page-eyebrow">
        <span>Contesto / Data</span>
        <span>·</span>
        <span>Stato</span>
      </div>
      <h1 class="page-title">Titolo Pagina (32px bold)</h1>
      <p class="page-subtitle">Sottotitolo chiaro, informativo e rilassato.</p>
    </div>
    <div class="flex items-center gap-3 self-start md:self-auto">
      <!-- Eventuale azione primaria sobria -->
    </div>
  </div>
</header>
```

### Rimozione delle Funzioni Duplicate
- **Dashboard**: rimosso il riquadro saldo nell'header (il saldo è già nella navbar); rimossa la riga compressa di 4 pillole accanto al titolo.
- **Comparatore**: rimosso il blocco scuro "Preventivo veloce" che chiedeva CAP e peso una seconda volta sopra il form reale dei colli.
- **Portafoglio**: rimosso il pulsante isolato "Nuova Spedizione" dall'header della card.
- **Tracking**: rimosso il pulsante tratteggiato duplicato "+ Aggiungi spedizione" in fondo all'elenco spedizioni attive.

---

## 5. Mappa dei File e Responsabilità Tecniche

| File | Percorso | Ruolo |
|---|---|---|
| `main.css` | `assets/css/main.css` | **Foglio universale**: design tokens, reset, navbar, notifiche, user chip, `.app-page-container`, `.page-header`, footer |
| `nav-user.js` | `assets/js/nav-user.js` | **Logica universale**: apertura/chiusura mutua dropdown utente e notifiche, click outside, tasto `Esc` |
| `index.html` | `/index.html` | Homepage pre-login (ancora `#tariffe`, calcolatore risparmio, FAQ, footer con logo chiaro) |
| `dashboard.html` | `/dashboard.html` | Dashboard utente: saluto, stato 14 spedizioni, oggi in consegna (3 card), tabella ultime spedizioni |
| `comparatore.html` | `/comparatore.html` | Modulo spedizione: colli, mittente/destinatario, stepper 1-2-3, confronto corrieri in tempo reale |
| `tracking.html` | `/tracking.html` | Tracking live: barra KPI, filtro mie spedizioni / cerca codice, mappa radar e cronologia tappe |
| `portafoglio.html` | `/portafoglio.html` | Portafoglio & Credito: card saldo scura sobria, ricarica credito con input chiaro SaaS, storico transazioni |
| `impostazioni.html` | `/impostazioni.html` | Gestione account: dati personali, sicurezza, fatturazione |
| `admin.html` | `/admin.html` | Topbar admin con notifiche operative e link di ritorno all'app |

---

## 6. Prossimi Passi Consigliati per le Nuove Sessioni
1. **Rifinitura Grafica e Micro-Interazioni**:
   - Verificare gli stati di hover e focus accessibili su tutti gli input delle 4 pagine.
   - Semplificare eventuali testi lunghi rimasti nelle card del comparatore.
2. **Integrazione Backend Python**:
   - La struttura del frontend è ora pulita, modulare e pronta per essere servita da un backend Python (es. FastAPI / Flask) con template Jinja2 o API JSON per il calcolo tariffe e il tracciamento dei corrieri.
