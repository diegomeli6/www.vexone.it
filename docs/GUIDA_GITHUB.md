# Guida al Push del Remake su GitHub

Questa guida ti accompagna passo-passo nella pubblicazione del tuo remake su GitHub.

---

## 1. Crea il repository su GitHub

1. Vai su [github.com/new](https://github.com/new)
2. Assegna un nome al repository (es. `vexone` oppure `www.vexone.it`)
3. Scegli se renderlo **Public** o **Private**
4. **IMPORTANTE**: Lascia **deselezionate** le caselle *"Add a README file"*, *"Add .gitignore"* e *"Choose a license"* (abbiamo già preparato tutto noi in locale).
5. Clicca su **Create repository**.

---

## 2. Collega ed esegui il Push dal tuo Terminale

Apri il terminale nella cartella del progetto (`/Users/diego/Desktop/www.vexone.it`) ed esegui:

```bash
# 1. Collega il tuo repository remoto (sostituisci con il tuo URL GitHub effettivo)
git remote add origin https://github.com/TUO_USERNAME/TUO_REPO.git

# 2. Assicurati che il branch si chiami main
git branch -M main

# 3. Effettua il primo push
git push -u origin main
```

---

## 3. Perché il repository è ottimizzato?

- **Leggero e Veloce**: L'archivio del vecchio sito Next.js (~94MB) è conservato nella cartella `legacy_archive/` sul tuo Mac, ma è escluso da Git tramite `.gitignore`.
- **Root Pulita**: Aprendo il repository su GitHub o distribuendolo su piattaforme di hosting (es. GitHub Pages, Vercel, Netlify), il file `index.html` e tutti gli asset (`assets/`, `carriers/`) si trovano al primo livello e funzioneranno immediatamente senza bisogno di configurazioni speciali.
- **File di sistema ignorati**: `.DS_Store` e altri file temporanei di macOS vengono automaticamente bloccati e non sporcheranno mai il tuo repository.
