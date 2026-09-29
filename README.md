# VexOne — Piattaforma Comparatore Spedizioni

VexOne è una piattaforma web moderna, rapida e intuitiva per il confronto in tempo reale delle tariffe dei principali corrieri espressi (DHL, UPS, FedEx, BRT, SDA, GLS, TNT, InPost), la gestione delle spedizioni, il tracciamento in tempo reale e la gestione del credito prepagato.

---

## 📁 Alberatura del Progetto

```text
www.vexone.it/
│
├── index.html                     # Homepage pubblica (hero, tariffe live, servizi, FAQ, CTA)
├── comparatore.html               # Nuova Spedizione: stepper interattivo, calcolo volumetrico e scelta corriere
├── checkout.html                  # Riepilogo finale, pagamento, note corriere e integrazione sessione
├── dashboard.html                 # Pannello utente: spedizioni attive, grafici e saldo
├── tracking.html                  # Ricerca e timeline dettagliata spedizioni
├── portafoglio.html               # Wallet: ricarica saldo, movimenti, filtri e fatture
├── portafoglio-impostazioni.html  # Configurazione metodi di ricarica e fatturazione automatica
├── impostazioni.html              # Impostazioni account, profilo e rubrica indirizzi
├── notifiche.html                 # Centro notifiche operative e aggiornamenti di stato
├── assistenza.html                # Centro assistenza, FAQ e form ticket di supporto
│
├── login.html                     # Autenticazione utente
├── register.html                  # Registrazione account (Privato o Azienda)
├── recupero-password.html         # Procedura di reset password
├── admin.html                     # Pannello di controllo amministrativo globale
│
├── privacy.html                   # Informativa sul trattamento dati personali (GDPR)
├── termini.html                   # Termini e condizioni generali del servizio
├── cookie.html                    # Cookie Policy estesa
│
├── assets/                        # Risorse statiche dell'applicazione
│   ├── css/                       # Design System modulare e fogli di stile
│   ├── js/                        # Script logici, navbar reattiva, configurazione Tailwind
│   ├── logos/                     # Logotipi ufficiali Vex One (chiaro e scuro)
│   ├── icons/                     # Favicon e icone grafiche
│   └── images/                    # Immagini e illustrazioni
│
├── carriers/                      # Loghi vettoriali (SVG) e raster ufficiali dei corrieri espressi
│
├── docs/                          # Documentazione tecnica, linee guida di design e recap storici
│   ├── RECAP_PROGETTO_AGGIORNATO.md
│   ├── RECAP_PROGETTO.md
│   └── RECAP_PROGETTO_E_ISTRUZIONI.md
│
├── legacy_archive/                # Archivio storico organizzato del vecchio sito Next.js e prototipi (.gitignore)
│
├── .gitignore                     # Esclusioni per Git e GitHub
└── README.md                      # Questo documento
```

---

## 🛠️ Tecnologie Utilizzate

- **HTML5 Semantico & Vanilla JavaScript (ES6+)**: Prestazioni elevate senza complessità di build.
- **Tailwind CSS (CDN)** & **CSS Custom Modulare**: Design System minimale, pulito e accessibile.
- **Tipografia Inter**: Font Google professionale ad alta leggibilità.
- **SVG Vettoriali Inline**: Iconografia nitida stile Lucide/Feather (**zero emoji**).
- **LocalStorage & SessionStorage API**: Persistenza locale dei dati utente e del flusso ordine.

---

## 🚀 Come visualizzare ed eseguire il sito in locale

1. **Tramite browser**: Apri direttamente il file `index.html` con qualsiasi browser web (Chrome, Safari, Edge, Firefox).
2. **Tramite server locale Python**:
   ```bash
   python3 -m http.server 3333
   ```
   e apri `http://localhost:3333` nel browser.
3. **Tramite Live Server**: Clicca col tasto destro su `index.html` nell'editor e seleziona *"Open with Live Server"*.

---

## 📦 Come effettuare il Push su GitHub

Il progetto è già predisposto con `.gitignore` per escludere l'archivio pesante del vecchio sito (`legacy_archive/`) e i file di sistema del Mac (`.DS_Store`).

Se il repository locale non è ancora collegato a GitHub, esegui dal terminale:

```bash
# 1. Aggiungi il tuo repository remoto GitHub
git remote add origin https://github.com/TUO-USERNAME/NOME-REPO.git

# 2. Imposta il branch principale su main
git branch -M main

# 3. Invia i file su GitHub
git push -u origin main
```
