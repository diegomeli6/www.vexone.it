# VEX ONE — Documento di Recap Completo & Guida alla Continuità

> **Versione aggiornata**: 2026-09-03  
> **Scopo**: questo file è la guida ufficiale del progetto. Va letto all'avvio di ogni nuova sessione di lavoro. Contiene tutte le decisioni tecniche, le regole di design, la struttura del codice e la cronologia completa di ogni modifica apportata.

---

## INDICE

1. [Sicurezza & Ambiente di Lavoro](#1-sicurezza--ambiente-di-lavoro)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Struttura File Completa](#3-struttura-file-completa)
4. [Design System & Regole Grafiche](#4-design-system--regole-grafiche)
5. [Componente Navbar](#5-componente-navbar)
6. [Componente Footer Universale](#6-componente-footer-universale)
7. [Flusso di Autenticazione](#7-flusso-di-autenticazione)
8. [Specifiche delle Pagine](#8-specifiche-delle-pagine)
9. [Cronologia Completa delle Modifiche](#9-cronologia-completa-delle-modifiche)
10. [Regole e Convenzioni Progettuali](#10-regole-e-convenzioni-progettuali)
11. [ID HTML Chiave](#11-id-html-chiave)
12. [Note Tecniche & Prossimi Passi](#12-note-tecniche--prossimi-passi)

---

## 1. Sicurezza & Ambiente di Lavoro

- **Il sito online NON viene mai toccato**: tutto lo sviluppo avviene in locale nella cartella `/Users/diego/Desktop/www.vexone.it/vexone_remake/`.
- **Server locale**: `python3 -m http.server 3333` → `http://localhost:3333`
- **Backup disponibile** nella cartella `archive/` (vecchio sito).
- **Dati nei form**: salvati solo in `localStorage` e `sessionStorage` del browser locale. Nessuna API reale attiva.
- **localStorage key principale**: `vexone:user:v1` — JSON con: `nome`, `cognome`, `email`, `piano`, `saldo`
- **Avviso Google Chrome "Password compromessa"**: ignorarlo — era dovuto a password di test generiche nei form, non a vulnerabilità reali.

---

## 2. Stack Tecnologico

- **100% HTML5 + CSS3 + Vanilla JavaScript ES6** — nessun framework JS, nessun Python nel frontend
- **Tailwind CSS CDN** per utility classes (`https://cdn.tailwindcss.com`) — configurato con colori custom in `assets/js/tailwind-config.js`
- **Google Fonts** — Inter (`wght@400;500;600;700;800`)
- **Icone**: SVG inline stile Lucide/Feather — **ZERO emoji** in tutto il sito

> ⚠️ IMPORTANTE: Il CDN Tailwind non genera sempre tutte le utility JIT. Per il **footer** e altre sezioni che dipendono da classi grid avanzate (`grid-cols-4`, `text-[13px]`, `gap-10`), usare **inline `style`** invece di classi Tailwind. Le classi semantiche in `main.css` non hanno questo problema.

---

## 3. Struttura File Completa

```
/Users/diego/Desktop/www.vexone.it/vexone_remake/
│
├── index.html                     ← Homepage pubblica (hero, comparatore inline, features, FAQ, CTA)
├── login.html                     ← Login account
├── register.html                  ← Registrazione (switcher Privato / Azienda)
├── recupero-password.html         ← Reset password
│
├── dashboard.html                 ← Dashboard utente (KPI, spedizioni recenti, quick actions)
├── comparatore.html               ← Nuova Spedizione (stepper 4-step, multi-collo, risultati corrieri)
├── tracking.html                  ← Tracking spedizioni (lista + ricerca codice + dettaglio)
├── portafoglio.html               ← Portafoglio crediti (saldo, ricarica, movimenti mensili)
├── portafoglio-impostazioni.html  ← Gestione portafoglio (storico PDF, carte, auto-ricarica, fatturazione)
├── impostazioni.html              ← Impostazioni account (profilo, password, 2FA, notifiche)
│
├── checkout.html                  ← Checkout spedizione (riepilogo, pagamento, etichetta)
├── admin.html                     ← Pannello Super Admin (sidebar scura, gestione utenti/corrieri)
├── assistenza.html                ← Centro assistenza (FAQ, form contatto, guide imballaggio)
├── privacy.html                   ← Privacy Policy
├── termini.html                   ← Termini & Condizioni
├── cookie.html                    ← Cookie Policy
│
└── assets/
    ├── css/
    │   ├── main.css               ← DESIGN SYSTEM UNIVERSALE (variabili, navbar, footer, componenti)
    │   ├── style.css              ← Override globali legacy (minimal)
    │   └── pages/
    │       ├── home.css           ← Homepage (animazioni, comparatore, FAQ, drawer mobile)
    │       ├── dashboard.css
    │       ├── comparatore.css
    │       ├── tracking.css
    │       ├── portafoglio.css    ← Include anche .toast, .fab-new-shipment
    │       ├── impostazioni.css   ← .side-link, .toggle, .sec, .pay-card
    │       ├── admin.css
    │       ├── assistenza.css
    │       ├── checkout.css
    │       └── legal.css
    ├── js/
    │   ├── nav-user.js            ← Dropdown utente e pannello notifiche (universale)
    │   └── tailwind-config.js     ← Colori brand: vexBlue, vexLime, vexDark, vexGray
    ├── logos/
    │   ├── logo-dark.svg          ← Logo su sfondo chiaro (navbar)
    │   ├── logo.svg               ← Logo su sfondo scuro (footer)
    │   └── carriers/              ← brt, dhl, dva, dvalm, fedex, gls, inpost, poste, sda, tnt, ups
    └── icons/
        └── favicon.svg
```

---

## 4. Design System & Regole Grafiche

### Variabili CSS (`main.css`)
```css
:root {
  --color-dark:       #0A0A0B;
  --color-white:      #FFFFFF;
  --color-blue:       #0078FF;   /* azione primaria, link attivi */
  --color-lime:       #B8FF00;   /* accenti speciali, badge energici */
  --color-text:       #111827;
  --color-text-muted: #6B7280;
  --color-border:     #E5E7EB;
  --color-bg:         #F9FAFB;
  --radius-sm:        12px;
  --radius-md:        18px;
  --radius-lg:        9999px;    /* pill/badge */
  --duration:         0.2s;
  --ease-out:         cubic-bezier(0.23, 1, 0.32, 1);
  --font-sans:        'Inter', system-ui, sans-serif;
}
```

### Palette colori
| Colore | Hex | Uso |
|--------|-----|-----|
| Blu brand | `#0078FF` | Azioni primarie, link attivi, focus ring, indicatori |
| Lime brand | `#B8FF00` | Accenti energici, badge, hover speciali |
| Scuro brand | `#0A0A0B` | Sfondi scuri (footer, admin, hero dark card) |
| Verde monetario | `#16A34A` | Credito, risparmio, stato "Consegnato" |
| Ambra | `#D97706` | "In Transito", avvisi operativi |
| Rosso | `#DC2626` | Anomalie, azioni distruttive, zona pericolosa |

### Regole tipografiche
- **Font**: solo `Inter` — pesi 400, 500, 600, 700 (no 800/900, no corsivi)
- **Dimensioni**: mai sotto `11px`. Badge/meta: `11-12px`. Corpo: `13-14px`. Titoli: da `16px` in su
- **ZERO emoji** in tutto il progetto — solo SVG Lucide/Feather

### Regole di layout
- **Container pagine app**: max-width `1240px`, centrato, padding laterale `24px → 32px → 48px`
- **Card**: `background:#FFFFFF`, `border:1px solid #E5E7EB`, `border-radius:var(--radius-md)`, `box-shadow:0 1px 3px rgba(0,0,0,0.04)`
- **Sfondo pagine**: `#F9FAFB` o `#F4F5F7`
- **No gradienti casuali, no blob con `filter:blur()` colorati**

### Colori Tailwind custom (`tailwind-config.js`)
- `vexBlue`: `#0078FF` | `vexLime`: `#B8FF00` | `vexDark`: `#0A0A0B` | `vexGray`: `#F9FAFB`

---

## 5. Componente Navbar

### Caricamento CSS nelle pagine app
```html
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="assets/js/tailwind-config.js"></script>
<link rel="stylesheet" href="assets/css/main.css">
<link rel="stylesheet" href="assets/css/pages/[pagina].css">
<!-- OBBLIGATORIO alla fine del body: -->
<script src="assets/js/nav-user.js"></script>
```

### 5A — Navbar Pagine App (universale post-login)

Presente **identica** su: `dashboard.html`, `comparatore.html`, `tracking.html`, `portafoglio.html`, `portafoglio-impostazioni.html`, `impostazioni.html`.

**Regole fisse:**
- **Dashboard è sempre la prima voce** del menu centrale
- **Logo** → `dashboard.html` (sempre, nelle pagine app)
- Campanella, wallet pill e user chip: altezza allineata `42px`

**Struttura HTML:**
```html
<nav id="main-nav" aria-label="Navigazione principale">
  <div style="max-width:1560px;margin:0 auto" class="px-5 sm:px-6 py-3.5 flex justify-between items-center gap-4">

    <a href="dashboard.html" class="flex items-center gap-2 flex-shrink-0">
      <img src="assets/logos/logo-dark.svg" alt="VEX ONE" class="nav-logo">
    </a>

    <!-- Link centrali — Dashboard SEMPRE primo -->
    <div class="hidden lg:flex items-center gap-8" role="menubar">
      <a href="dashboard.html"   class="nav-link">Dashboard</a>
      <a href="comparatore.html" class="nav-link">Nuova Spedizione</a>
      <a href="tracking.html"    class="nav-link">Tracking</a>
      <a href="portafoglio.html" class="nav-link">Portafoglio</a>
    </div>

    <div class="flex items-center gap-3 flex-shrink-0">
      <!-- Notifiche -->
      <div class="notif-wrap" id="notif-wrap">
        <button class="notif-btn" id="notif-btn" onclick="toggleNavNotif(event)" aria-haspopup="true" aria-expanded="false">
          <!-- bell SVG -->
          <span class="notif-badge" id="notif-badge">3</span>
        </button>
        <div class="notif-panel" id="notif-panel"><!-- lista notifiche --></div>
      </div>

      <!-- Wallet pill -->
      <a href="portafoglio.html" class="nav-wallet-pill" style="text-decoration:none">
        <!-- wallet SVG -->
        <span id="nav-saldo-val">€ 124,50</span>
        <span class="plus-badge">+</span>
      </a>

      <!-- User chip + dropdown -->
      <div id="nav-user-wrap">
        <button class="nav-user-chip" id="nav-user-btn" onclick="toggleNavUserDropdown(event)" aria-haspopup="true" aria-expanded="false">
          <div class="nav-user-avatar">DA</div>
          <div class="nav-user-info">
            <span style="font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:rgba(10,10,11,.45)">VEX PRO</span>
            <span style="font-size:12px;font-weight:700">Damiano Arcidiacono</span>
          </div>
          <svg class="nav-chevron"><!-- chevron-down --></svg>
        </button>

        <div class="nav-dropdown-menu" id="nav-user-dropdown" role="menu">
          <div class="nav-dd-user-block">
            <div class="nav-dd-avatar">DA</div>
            <div>
              <p class="nav-dd-name">Damiano Arcidiacono</p>
              <p class="nav-dd-email">damiano@vexone.it</p>
            </div>
          </div>
          <div class="nav-dd-sep"></div>
          <a href="comparatore.html"  class="nav-dd-link">Nuova Spedizione</a>
          <a href="dashboard.html"    class="nav-dd-link">Dashboard</a>
          <a href="tracking.html"     class="nav-dd-link">Tracking Spedizioni</a>
          <a href="portafoglio.html"  class="nav-dd-link">Portafoglio & Ricarica</a>
          <div class="nav-dd-sep"></div>
          <a href="impostazioni.html" class="nav-dd-link">Impostazioni Account</a>
          <a href="admin.html"        class="nav-dd-link">Pannello Super Admin</a>
          <div class="nav-dd-sep"></div>
          <a href="index.html" class="nav-dd-link danger">Esci dall'account</a>
        </div>
      </div>
    </div>
  </div>
</nav>

<!-- FAB Nuova Spedizione (su tutte le pagine app TRANNE impostazioni.html) -->
<a href="comparatore.html" class="fab-new-shipment" aria-label="Nuova spedizione">
  <span class="fab-icon">+</span>
  <span>Nuova Spedizione</span>
</a>
```

**CSS chiave (in `main.css`):**
```css
#main-nav { position:sticky; top:0; z-index:100; background:rgba(255,255,255,0.95); backdrop-filter:blur(20px); border-bottom:1px solid #E5E7EB; box-shadow:0 1px 3px rgba(0,0,0,0.04); }
.nav-logo  { height:28px; width:auto; }
.nav-link  { font-size:13px; font-weight:500; color:#4B5563; text-decoration:none; transition:all .2s; }
.nav-link:hover  { color:#0A0A0B; }
.nav-link.active { color:#0078FF; font-weight:600; }
.nav-wallet-pill { display:inline-flex; align-items:center; gap:6px; background:#F0F9FF; border:1px solid #BAE6FD; color:#0078FF; font-size:13px; font-weight:700; padding:6px 12px; border-radius:9999px; }
.plus-badge { background:#0078FF; color:#fff; font-size:10px; font-weight:700; width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; }
.nav-user-chip { display:inline-flex; align-items:center; gap:8px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:9999px; padding:4px 12px 4px 4px; cursor:pointer; }
.nav-user-avatar { width:28px; height:28px; background:#0078FF; color:#fff; border-radius:50%; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; }
.nav-dropdown-menu { position:absolute; top:calc(100% + 10px); right:0; background:#fff; border-radius:18px; padding:8px; box-shadow:0 20px 60px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.05); min-width:240px; z-index:200; opacity:0; pointer-events:none; transform:translateY(-8px); transition:all .25s cubic-bezier(.23,1,.32,1); }
.nav-dropdown-menu.open { opacity:1; pointer-events:all; transform:translateY(0); }
.nav-dd-link { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:12px; font-size:12px; font-weight:700; color:#374151; text-decoration:none; transition:background .15s; }
.nav-dd-link:hover { background:#F8F9FA; color:#0A0A0B; }
.nav-dd-link.danger:hover { background:rgba(220,38,38,.06); color:#DC2626; }
.nav-dd-sep { height:1px; background:#F3F4F6; margin:6px 8px; }
.fab-new-shipment { position:fixed; bottom:26px; right:26px; z-index:900; display:inline-flex; align-items:center; gap:8px; background:#0A0A0B; color:#fff; padding:11px 18px; border-radius:9999px; font-size:12.5px; font-weight:600; text-decoration:none; box-shadow:0 8px 24px rgba(0,0,0,.2); border:1px solid rgba(255,255,255,.15); transition:all .25s cubic-bezier(.23,1,.32,1); }
.fab-new-shipment .fab-icon { width:20px; height:20px; border-radius:50%; background:#B8FF00; color:#0A0A0B; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; }
```

**JS universale (`nav-user.js`):** gestisce `toggleNavUserDropdown()`, `closeNavUserDropdown()`, `toggleNavNotif()`, `closeNavNotif()`, `markAllNavNotifsRead()`. Click-outside e `Esc` chiudono automaticamente.

---

### 5B — Navbar Homepage (`index.html`) — Biforcata per Stato Login

La navbar della homepage si adatta automaticamente leggendo `localStorage.getItem('vexone:user:v1')`.

**Struttura duale:**
```html
<!-- Guest: link sezioni homepage -->
<div id="nav-links-guest">Home | Tariffe | Servizi | Chi siamo</div>

<!-- Loggato: link pagine app (nascosto di default) -->
<div id="nav-links-app" style="display:none!important">
  Dashboard | Nuova Spedizione | Tracking | Portafoglio
</div>

<!-- Guest: pulsanti Accedi + Registrati -->
<div id="nav-guest-btns">...</div>

<!-- Loggato: wallet pill + user chip con dropdown (nascosto di default) -->
<div id="nav-app-actions" style="display:none!important">...</div>
```

**Logo**: `onclick="window.location.href=(window._vexLoggedIn ? 'dashboard.html' : 'index.html')"`

**Mobile drawer biforcato:**
```html
<div id="mob-guest-links">Home | Tariffe | Servizi | Chi siamo | Accedi | Registrati</div>
<div id="mob-app-links" style="display:none">
  Dashboard | Nuova Spedizione | Tracking | Portafoglio | Impostazioni Account | Esci
</div>
```

**JS di inizializzazione** (blocco script separato in fondo a `index.html`):
```js
const KEY_USER = 'vexone:user:v1';
(function initHomeNav() {
  const safeGet    = (k) => { try { return localStorage.getItem(k); } catch(e) { return null; } };
  const safeRemove = (k) => { try { localStorage.removeItem(k); } catch(e) {} };
  const raw = safeGet(KEY_USER);
  let user = null;
  try { user = raw ? JSON.parse(raw) : null; } catch(e) {}
  window._vexLoggedIn = !!user;

  if (user) {
    // Nascondi guest, mostra app
    document.getElementById('nav-links-guest').style.display = 'none';
    document.getElementById('nav-guest-btns').style.display  = 'none';
    document.getElementById('nav-links-app').style.cssText   = 'display:flex!important';
    document.getElementById('nav-app-actions').style.cssText = 'display:flex!important';
    // Popola initials, nome, piano, saldo nel chip e dropdown
    // ...
    // Mobile
    document.getElementById('mob-guest-links').style.display = 'none';
    document.getElementById('mob-app-links').style.display   = 'block';
  }

  window.logoutHome = function() {
    safeRemove(KEY_USER);
    window.location.href = 'index.html';
  };
})();
```

---

## 6. Componente Footer Universale

Presente su: `dashboard.html`, `comparatore.html`, `tracking.html`, `portafoglio.html`, `portafoglio-impostazioni.html`, `impostazioni.html`.  
**Non** su `index.html` (footer custom con classi `.bg-vexDark`).

**HTML (usa inline styles per grid — compatibile senza Tailwind JIT):**
```html
<footer class="vex-footer">
  <div style="max-width:80rem;margin:0 auto;padding:0 1.5rem">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:2.5rem">
      <div>
        <div style="margin-bottom:1rem">
          <img src="assets/logos/logo.svg" alt="VEX ONE" style="height:32px;width:auto">
        </div>
        <p style="font-size:13px;font-weight:500;line-height:1.6;color:rgba(255,255,255,.5);margin:0">
          Il comparatore corrieri italiano.
        </p>
      </div>
      <div>
        <p class="foot-title">Piattaforma</p>
        <a href="comparatore.html" class="foot-link">Calcola Tariffa</a>
        <a href="tracking.html"    class="foot-link">Traccia Spedizione</a>
        <a href="dashboard.html"   class="foot-link">Dashboard</a>
      </div>
      <div>
        <p class="foot-title">Supporto</p>
        <a href="assistenza.html"      class="foot-link">Centro Assistenza</a>
        <a href="assistenza.html#form" class="foot-link">Contatta</a>
        <a href="assistenza.html"      class="foot-link">Come Imballare</a>
      </div>
      <div>
        <p class="foot-title">Legale</p>
        <a href="privacy.html" class="foot-link">Privacy Policy</a>
        <a href="termini.html" class="foot-link">Termini & Condizioni</a>
        <a href="cookie.html"  class="foot-link">Cookie Policy</a>
      </div>
    </div>
    <div class="foot-sep"></div>
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;font-size:11px;font-weight:500;color:rgba(255,255,255,.35)">
      <span>© 2026 VEX ONE Srl · P.IVA 01234567890</span>
      <span>Made with <span style="color:#B8FF00">●</span> in Italia</span>
    </div>
  </div>
</footer>
```

**CSS (in `main.css`):**
```css
.vex-footer  { background:#0A0A0B; color:#FFFFFF; padding:50px 0 24px; margin-top:50px; border-top:1px solid rgba(255,255,255,0.08); }
.foot-title  { font-size:11px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:rgba(255,255,255,.4); margin-bottom:16px; }
.foot-link   { display:block; font-size:13px; font-weight:500; color:rgba(255,255,255,.7); text-decoration:none; padding:4px 0; transition:color .2s; }
.foot-link:hover { color:#FFFFFF; }
.foot-sep    { height:1px; background:rgba(255,255,255,.08); margin:32px 0 20px; }
```

---

## 7. Flusso di Autenticazione

```
index.html ──[Registrati]──→ register.html ──[OK]──→ dashboard.html
index.html ──[Accedi]──────→ login.html    ──[OK]──→ dashboard.html
login.html ──[Dimentico]───→ recupero-password.html
```

**Storage**: `localStorage` chiave `vexone:user:v1`  
**Schema JSON**: `{ nome, cognome, email, piano, saldo }`  
**Esempio**: `{"nome":"Damiano","cognome":"Arcidiacono","email":"damiano@vexone.it","piano":"pro","saldo":124.50}`

Altre chiavi localStorage: `vex_cookies` (preferenze cookie), `vex_exit_shown` (exit intent già mostrato).

---

## 8. Specifiche delle Pagine

### `index.html` — Homepage Pubblica
- Navbar dinamica (§5B): guest = Home/Tariffe/Servizi/Chi siamo; loggato = link app + chip
- Sezioni: Hero con form comparatore inline, slider loghi corrieri, Perché sceglierci (3 card), Timeline processo, Tariffe, FAQ, CTA email, Footer custom
- **Card "Perché sceglierci"** (`.feat-card`): hover cambia colore a sfondo, testo e icone
  - `.c-b:hover` → sfondo `#0078FF`, testo bianco, icona bianca
  - `.c-l:hover` → sfondo `#B8FF00`, testo `#0A0A0B`, icona scura
  - `.c-w:hover` → sfondo bianco, accento blu
- **Timeline pallini** (`.tl-dot`): icone SVG sempre bianche (`stroke:#FFFFFF!important`)
- Cookie banner GDPR (`#cookie-banner`), exit intent toast

### `dashboard.html` — Dashboard
- Navbar universale (Dashboard attivo), FAB Nuova Spedizione
- KPI cards, quick actions, mappa live, spedizioni recenti
- **Benvenuto**: SOLO "Nuova Spedizione" e "Gestione Portafoglio" — rimosso badge "Hub Milano"

### `comparatore.html` — Nuova Spedizione
- Navbar universale (Nuova Spedizione attivo), FAB
- Stepper 4 step con progress bar animata:
  1. Dettagli spedizione
  2. Mittente & Destinatario
  3. Scelta corriere
  4. Pagamento & conferma
- Pallino step 3 si accende SOLO quando step === 3
- Step 2: Avanti/Indietro (riga 1), "Aggiungi alla rubrica" (riga 2, sotto)
- Pulsante "Inverti" mittente/destinatario: RIMOSSO
- Toast: pallino verde inline a sinistra — mai sopra il testo

### `tracking.html` — Tracking
- Navbar universale (Tracking attivo), FAB
- Search bar codice | lista spedizioni | dettaglio
- Toast fisso (non lampeggiante)

### `portafoglio.html` — Portafoglio
- Navbar universale (Portafoglio attivo), FAB
- 2 colonne: **Sinistra sticky** (`top:86px`) con saldo + ricarica + card nav rapida | **Destra scrollabile** con movimenti mensili
- Dropdown utente → `impostazioni.html`

### `portafoglio-impostazioni.html` — Gestione Portafoglio
- Navbar universale (Portafoglio in blu), FAB
- **Breadcrumb**: `Portafoglio / Gestione & Impostazioni` (senza "Dashboard /")
- Contenitore max-w-6xl con padding laterale
- Sezioni (anchor): Storico Transazioni | Carte Memorizzate | Auto-ricarica & Limiti | Dati Fatturazione
- Storico: checkbox per riga + "Seleziona tutte" + "Esporta PDF Storico" (`window.print()`)
- Auto-ricarica & Limiti: INPUT NUMERICI — non switch
- Nessun banner "Piano Premium"
- Footer universale

### `impostazioni.html` — Impostazioni Account
- Navbar universale (nessun link attivo), **NO FAB**
- Sidebar: Profilo | Sicurezza | Pagamenti | Notifiche | Account (rosso)
- In fondo sidebar: "⚙️ Portafoglio & Limiti →" → `portafoglio-impostazioni.html`
- Sezione Pagamenti: banner + pulsante "Gestione Portafoglio →"
- Footer universale con inline styles per grid

### `checkout.html`, `admin.html`, `assistenza.html`
- **Checkout**: riepilogo, pagamento, download etichetta
- **Admin**: sidebar scura `#0A0A0B`, logo bianco, badge ADMIN PANEL lime
- **Assistenza**: FAQ accordion, form contatto, guide imballaggio

---

## 9. Cronologia Completa delle Modifiche

### Sessioni Precedenti (ante chat corrente)

| # | Richiesta | Azione |
|---|-----------|--------|
| 1 | Sicurezza sito online e dati | Confermato lavoro solo locale |
| 2 | Bug "Usa i miei dati" incompleto | Fix mappatura dinamica Privato/Azienda |
| 3 | Flusso confuso | Riordinata struttura Homepage → Comparatore → Checkout → Dashboard |
| 4 | Cartella separata e backup | Creata `vexone_remake/` |
| 5 | Chiarimento stack | HTML/CSS/JS puro, nessun Python nel frontend |
| 6 | Audit pagine mancanti | Rilevate: login, register, recupero-password |
| 7 | Creazione pagine mancanti | Create login, register, recupero-password |
| 8 | Ripristino admin sidebar scura | Sidebar `#0A0A0B` con logo bianco e badge ADMIN |
| 9 | "Usa i miei dati" con avvisi | Toast avviso + focus automatico su campo mancante |
| 10 | Form a step scorrevoli | Slide orizzontali: Step 1 → 2 → 3 |
| 11 | 3 numerini uniformi | Neutri 45% inattivi, blu pieno attivi/completati |
| 12 | Resoconto colli | Resoconto dettagliato peso/dim/volumetrico |
| 13 | Card corrieri compatte | Ridotte altezza e padding |
| 14 | No banner luminosi | Badge discreti: Veloce, Economico, Consigliato |
| 15 | Spazio tra prezzo e tasto | `.price-action-group` con 20px fissi |
| 16 | Loghi corrieri SVG ufficiali | BRT, DHL, FedEx, GLS, UPS, SDA, TNT, InPost |

### Chat Corrente — Sessione Completa

| Ref | Richiesta | Azione eseguita |
|-----|-----------|-----------------|
| A | Pulizia stile: zero emoji, Inter pura, no dark mode toggle | Rimosso toggle; sostituite tutte le emoji con SVG; uniformato font |
| B | Navbar universale post-login identica su tutte le pagine | Creata navbar con logo, 4 link centrali, notifiche, wallet pill, user chip — tutto in `main.css` + `nav-user.js` |
| C | Dashboard prima voce menu | Ordine fisso: Dashboard | Nuova Spedizione | Tracking | Portafoglio |
| D | FAB "Nuova Spedizione" fisso su tutte le pagine app | Aggiunto `.fab-new-shipment` su dashboard, comparatore, tracking, portafoglio, portafoglio-impostazioni |
| E | Pallino step 3 comparatore acceso troppo presto | Fix JS: pallino attivo SOLO quando step === 3 |
| F | Step 2 pulsanti su 2 righe | Avanti/Indietro sopra; "Aggiungi rubrica" sotto con spazio |
| G | Rimovere pulsante "Inverti" | Rimosso da HTML e CSS |
| H | Toast: pallino inline a sinistra, non lampeggiante | `.toast-dot` in flex row; rimossa animazione pulse nelle pagine app |
| I | Dashboard: benvenuto senza "Hub Milano" | Rimosso badge Hub; rimasti solo "Nuova Spedizione" e "Gestione Portafoglio" |
| J | Tracking: struttura layout | Lista + dettaglio + search; mappa opzionale |
| K | Portafoglio: colonna sinistra sticky, selezione carta | Sticky `top:86px`; UI selezione carta memorizzata/nuova |
| L | Portafoglio: grafica elementi mese | Barre spesa allineate, font uniformi |
| M | Piano Premium: rimosso | Eliminato da portafoglio-impostazioni.html |
| N | Metodi pagamento: solo carta | Gli altri metodi disabilitati visivamente |
| O | Auto-ricarica e limiti: non switch | Form con input numerici |
| P | Storico: selezionabili + export PDF | Checkbox per riga, "Seleziona tutte", `window.print()` |
| Q | Portafoglio impostazioni come sottopagina separata | Creata `portafoglio-impostazioni.html` |
| R | Card homepage: colore hover anche su testi/icone | CSS `.feat-card.c-b/c-l/c-w:hover` aggiornati per testi e SVG |
| S | Timeline pallini: icone bianche | `stroke:#FFFFFF!important` sui SVG nei `.tl-dot` |
| T | Navbar impostazioni.html: CSS non universali | Correto ordine link, allineate classi CSS |
| U | Portafoglio-impostazioni: breadcrumb con "Dashboard /" | Rimosso; breadcrumb: `Portafoglio / Gestione & Impostazioni` |
| V | Portafoglio-impostazioni: body senza margini | Aggiunto max-w-6xl con padding laterale |
| W | Impostazioni confuse con portafoglio | Ripristinate come pagine SEPARATE |
| X | Impostazioni: link verso portafoglio-impostazioni | Sidebar: "Portafoglio & Limiti →"; sezione Pagamenti: banner + pulsante |
| Y | Footer mancante in impostazioni.html | Aggiunto `<footer class="vex-footer">` con inline styles |
| Z | Stili `.vex-footer` in `main.css` | Aggiunte `.vex-footer`, `.foot-title`, `.foot-link`, `.foot-sep` in `main.css` |
| AA | Dropdown: voce "Impostazioni Account" su tutte le pagine | Aggiornato su: dashboard, tracking, comparatore, portafoglio, portafoglio-impostazioni, impostazioni |
| AB | Navbar homepage dinamica: loggato vede link app | Struttura duale `nav-links-guest`/`nav-links-app`, JS `initHomeNav()` |
| AC | Mobile drawer homepage biforcato | `mob-guest-links`/`mob-app-links`, JS nasconde/mostra in base a login |
| AD | Logo homepage: dashboard se loggato, home se no | `onclick="window.location.href=(window._vexLoggedIn ? 'dashboard.html' : 'index.html')"` |
| AE | Footer impostazioni.html: CSS non applicato | Sostituiti classi Tailwind JIT con inline styles per grid e padding |

---

## 10. Regole e Convenzioni Progettuali

1. **Dashboard è sempre la prima voce** del menu centrale nelle navbar delle pagine app
2. **Logo nelle pagine app** → sempre `dashboard.html`
3. **Logo nella homepage** → `dashboard.html` se loggato, `index.html` se non loggato
4. **`impostazioni.html`** = impostazioni ACCOUNT (profilo, password, 2FA, notifiche, elimina). Non include funzioni del wallet
5. **`portafoglio-impostazioni.html`** = gestione WALLET (storico, carte, auto-ricarica, limiti, fatturazione). Non include impostazioni account
6. **Collegamento tra le due**: in `impostazioni.html` ci sono il link sidebar e il banner in sezione Pagamenti
7. **Nessun piano/abbonamento** nell'interfaccia (rimuovere qualsiasi banner "Piano Premium")
8. **Metodi pagamento**: solo carta abilitata; gli altri disabilitati visivamente
9. **Auto-ricarica e limiti spesa**: INPUT NUMERICI — mai switch on/off
10. **Toast**: `.toast-dot` verde a sinistra in flex row — MAI sopra il testo; fisso (non lampeggiante) nelle pagine app
11. **FAB**: presente su dashboard, comparatore, tracking, portafoglio, portafoglio-impostazioni. ASSENTE su impostazioni.html e pagine pubbliche/legali
12. **Footer in pagine senza Tailwind CDN completo**: usare inline `style` per `display:grid` e `padding` del contenitore
13. **Breadcrumb `portafoglio-impostazioni.html`**: `Portafoglio / Gestione & Impostazioni` — senza "Dashboard /"
14. **Storico transazioni**: ogni riga con checkbox + "Seleziona tutte" + export `window.print()`
15. **ZERO emoji** — solo SVG inline stile Lucide/Feather

---

## 11. ID HTML Chiave

| ID | Elemento | Pagine |
|----|----------|--------|
| `main-nav` | Navbar container | Tutte |
| `nav-user-wrap` | Wrapper user chip | Pagine app |
| `nav-user-btn` | Bottone user chip | Pagine app |
| `nav-user-dropdown` | Dropdown utente | Pagine app |
| `nav-saldo-val` | Saldo in navbar | Pagine app |
| `notif-wrap` | Wrapper campanella | Pagine app |
| `notif-btn` | Bottone campanella | Pagine app |
| `notif-panel` | Pannello notifiche | Pagine app |
| `notif-badge` | Badge numero notifiche | Pagine app |
| `toast` | Container toast | Tutte |
| `toast-msg` | Testo toast | Tutte |
| `nav-links-guest` | Link sezioni homepage (guest) | `index.html` |
| `nav-links-app` | Link pagine app (loggato) | `index.html` |
| `nav-guest-btns` | Pulsanti Accedi/Registrati | `index.html` |
| `nav-app-actions` | Wallet pill + chip (loggato) | `index.html` |
| `mob-guest-links` | Drawer mobile (guest) | `index.html` |
| `mob-app-links` | Drawer mobile (loggato) | `index.html` |
| `nav-home-avatar` | Initials chip (home) | `index.html` |
| `nav-home-name` | Nome chip (home) | `index.html` |
| `nav-home-plan` | Piano chip (home) | `index.html` |
| `nav-dd-av` | Avatar dropdown (home) | `index.html` |
| `nav-dd-name` | Nome dropdown (home) | `index.html` |
| `nav-dd-email` | Email dropdown (home) | `index.html` |
| `cookie-banner` | Banner GDPR | `index.html` |
| `exit-toast` | Exit intent toast | `index.html` |

---

## 12. Note Tecniche & Prossimi Passi

### Note tecniche
- **Tailwind CDN**: non garantisce tutte le utility JIT. NON usare `text-[13px]`, `grid-cols-N`, `gap-10` per layout critici come footer — usare inline `style` o classi in `main.css`
- **Inter da Google Fonts**: caricare sempre `wght@400;500;600;700;800` nel `<head>`
- **localStorage**: `vexone:user:v1` (sessione utente), `vex_cookies` (cookie preference), `vex_exit_shown` (exit intent)
- **`nav-user.js`**: includerlo come ultimo `<script>` nel `<body>` su tutte le pagine app
- **`portafoglio-impostazioni.html`**: include `assets/js/nav-user.js` per il dropdown utente

### Prossimi passi
1. **Backend**: la struttura frontend è pronta per FastAPI/Flask con API JSON per tariffe reali e tracking live
2. **Autenticazione reale**: sostituire localStorage con JWT o sessioni server-side
3. **PDF export storico**: migliorare `@media print` in `portafoglio-impostazioni.html`
4. **Rubrica indirizzi**: collegare la rubrica salvata al form step 2 del comparatore
5. **Mappa live tracking**: integrare Leaflet.js o Google Maps per posizione corriere
