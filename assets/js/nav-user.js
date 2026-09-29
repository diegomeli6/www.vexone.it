/**
 * VexOne - Universal Navigation & Auth Engine (nav-user.js)
 * Sincronizza stato utente, saldo, notifiche e navigazione identica al 100% su tutte le pagine.
 */

// Sincronizzazione immediata al caricamento dello script
(function() {
  try {
    const isLogged = localStorage.getItem('vexone_logged_in') === 'true' || 
                     localStorage.getItem('vexone_logged_in') === '1' ||
                     localStorage.getItem('vexone:auth:v1') === 'true' ||
                     localStorage.getItem('vexone:auth:v1') === '1';
    if (isLogged) {
      document.documentElement.classList.add('is-logged-in');
    } else {
      document.documentElement.classList.remove('is-logged-in');
    }
  } catch(e) {}
})();

const VEX_AUTH = {
  KEY_LOGGED: 'vexone_logged_in',
  KEY_USER: 'vexone:user:v1',
  KEY_SALDO: 'vexone:wallet:saldo:v1',
  KEY_EMAIL: 'vexone_user_email',

  DEFAULT_USER: {
    nome: '',
    cognome: '',
    email: '',
    piano: 'VEX Base',
    initials: 'VX'
  },
  DEFAULT_SALDO: 0.00,

  isLoggedIn() {
    try {
      const logged = localStorage.getItem(this.KEY_LOGGED);
      if (logged === 'true' || logged === '1') return true;
      const auth = localStorage.getItem('vexone:auth:v1');
      if (auth === 'true' || auth === '1') return true;
      const token = localStorage.getItem('vexone_access_token');
      if (token && token.length > 10) return true;
    } catch(e) {}
    return false;
  },

  getUser() {
    try {
      const raw = localStorage.getItem(this.KEY_USER) || localStorage.getItem('vexone_user_profile');
      if (raw) {
        const u = JSON.parse(raw);
        
        let fullName = '';
        if (u.displayName && u.displayName.trim()) {
          fullName = u.displayName.trim();
        } else if (u.name && u.name.trim()) {
          fullName = u.name.trim();
        } else if (u.nome && u.cognome) {
          fullName = `${u.nome.trim()} ${u.cognome.trim()}`;
        } else if (u.nome && u.nome.trim()) {
          fullName = u.nome.trim();
        } else if (u.first_name || u.last_name) {
          fullName = `${u.first_name || ''} ${u.last_name || ''}`.trim();
        } else if (u.email) {
          fullName = u.email;
        } else {
          fullName = 'Utente VexONE';
        }

        // Rimozione duplicati consecutivi (es. "Rossi Rossi")
        const tokens = fullName.split(/\s+/).filter(Boolean);
        const uniqueTokens = [];
        for (let i = 0; i < tokens.length; i++) {
          if (i === 0 || tokens[i].toLowerCase() !== tokens[i-1].toLowerCase()) {
            uniqueTokens.push(tokens[i]);
          }
        }
        fullName = uniqueTokens.join(' ') || 'Utente VexONE';

        const email = u.email || localStorage.getItem(this.KEY_EMAIL) || '';
        const piano = u.piano || u.plan || 'VEX Base';
        const initials = u.initials || (uniqueTokens.length >= 2 
          ? (uniqueTokens[0].charAt(0) + uniqueTokens[1].charAt(0)).toUpperCase() 
          : (uniqueTokens[0] ? uniqueTokens[0].substring(0, 2).toUpperCase() : 'VX'));

        return {
          nome: uniqueTokens[0] || '',
          cognome: uniqueTokens.slice(1).join(' ') || '',
          displayName: fullName,
          email,
          piano,
          initials
        };
      }
    } catch(e) {}
    return {
      nome: '',
      cognome: '',
      displayName: 'Utente VexONE',
      email: '',
      piano: 'VEX Base',
      initials: 'VX'
    };
  },

  getSaldo() {
    try {
      const s = localStorage.getItem(this.KEY_SALDO);
      if (s !== null && !isNaN(parseFloat(s))) return parseFloat(s);
      const uRaw = localStorage.getItem(this.KEY_USER);
      if (uRaw) {
        const u = JSON.parse(uRaw);
        if (typeof u.creditRaw === 'number') return u.creditRaw;
      }
    } catch(e) {}
    return 0.00;
  },

  fmtEur(n) {
    return '€ ' + Number(n || 0).toLocaleString('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  login(email, userData) {
    try {
      localStorage.setItem(this.KEY_LOGGED, 'true');
      localStorage.setItem('vexone:auth:v1', 'true');
      const finalEmail = email || (userData && userData.email) || this.DEFAULT_USER.email;
      localStorage.setItem(this.KEY_EMAIL, finalEmail);
      const u = {
        ...this.DEFAULT_USER,
        ...(userData || {}),
        email: finalEmail
      };
      localStorage.setItem(this.KEY_USER, JSON.stringify(u));
    } catch(e) {}
  },

  logout() {
    try {
      localStorage.removeItem(this.KEY_LOGGED);
      localStorage.removeItem('vexone:auth:v1');
      localStorage.removeItem(this.KEY_EMAIL);
      localStorage.removeItem(this.KEY_USER);
      localStorage.removeItem('vexone_user');
      localStorage.removeItem('vexone_user_profile');
      localStorage.removeItem('vexone_access_token');
      sessionStorage.removeItem('vexone:checkout:v1');
    } catch(e) {}
    window.location.href = 'index.html';
  }
};

// Esponi auth globalmente
window.VEX_AUTH = VEX_AUTH;
window.vexLogout = function(e) {
  if (e) e.preventDefault();
  VEX_AUTH.logout();
};

/**
 * Mobile Drawer Unificato (Iniettato dinamicamente per garantire identità su ogni pagina)
 */
function ensureUniversalMobileDrawer(logged, user, saldoStr) {
  let drawer = document.getElementById('mob-drawer');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'mob-drawer';
    document.body.appendChild(drawer);
  }

  drawer.innerHTML = `
    <div id="mob-overlay" onclick="closeNavMobileMenu()"></div>
    <div id="mob-panel">
      <div class="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
        <a href="index.html" onclick="closeNavMobileMenu()" aria-label="Home">
          <img src="assets/logos/logo-dark.svg" alt="VEX ONE" style="height:22px;width:auto">
        </a>
        <button type="button" onclick="closeNavMobileMenu()" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-lg hover:bg-gray-200 transition cursor-pointer" aria-label="Chiudi menu">&times;</button>
      </div>

      ${!logged ? `
        <!-- Sezione Ospite -->
        <div id="mob-guest-links" class="flex flex-col gap-1">
          <a href="index.html" class="mob-link" onclick="closeNavMobileMenu()">Home</a>
          <a href="comparatore.html" class="mob-link" onclick="closeNavMobileMenu()">Nuova Spedizione</a>
          <a href="tracking.html" class="mob-link" onclick="closeNavMobileMenu()">Tracking Spedizioni</a>
          <a href="index.html#tariffe" class="mob-link" onclick="closeNavMobileMenu()">Tariffe</a>
          <a href="index.html#servizi" class="mob-link" onclick="closeNavMobileMenu()">Servizi</a>
          <a href="index.html#chi-siamo" class="mob-link" onclick="closeNavMobileMenu()">Chi siamo</a>
          
          <div class="mob-sep"></div>
          
          <div class="mt-4 flex flex-col gap-2.5">
            <a href="register.html" class="nav-btn-primary shine w-full text-center" style="padding:12px;border-radius:12px;display:block">Crea account gratis →</a>
            <a href="login.html" class="nav-btn-secondary w-full text-center" style="padding:11px;border-radius:12px;display:block">Accedi</a>
          </div>
        </div>
      ` : `
        <!-- Sezione Autenticato -->
        <div id="mob-app-links" class="flex flex-col gap-1">
          <div class="bg-gray-50 p-3 rounded-xl mb-3 border border-gray-100 flex items-center justify-between">
            <div class="min-w-0 pr-2">
              <span class="text-[10px] font-bold text-vexBlue uppercase tracking-wider">${user.piano}</span>
              <p class="text-xs font-bold text-gray-900 truncate m-0">${user.displayName}</p>
              <p class="text-[11px] text-gray-500 truncate m-0">${user.email}</p>
            </div>
            <a href="portafoglio.html" onclick="closeNavMobileMenu()" class="text-right flex-shrink-0 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-sm no-underline">
              <span class="text-[9px] uppercase font-bold text-gray-400 block">Saldo</span>
              <span class="text-xs font-bold text-green-600">${saldoStr}</span>
            </a>
          </div>

          <a href="index.html" class="mob-link" onclick="closeNavMobileMenu()">Home del sito</a>
          <a href="dashboard.html" class="mob-link" onclick="closeNavMobileMenu()">Dashboard</a>
          <a href="comparatore.html" class="mob-link" onclick="closeNavMobileMenu()">Nuova Spedizione</a>
          <a href="tracking.html" class="mob-link" onclick="closeNavMobileMenu()">Tracking Spedizioni</a>
          <a href="portafoglio.html" class="mob-link" onclick="closeNavMobileMenu()">Portafoglio & Ricarica</a>
          <a href="notifiche.html" class="mob-link" onclick="closeNavMobileMenu()">Centro Notifiche</a>
          <a href="impostazioni.html" class="mob-link" onclick="closeNavMobileMenu()">Impostazioni Account</a>

          <div class="mob-sep"></div>

          <button type="button" class="mob-link text-red-600 font-bold hover:bg-red-50 text-left w-full border-none bg-transparent cursor-pointer" onclick="vexLogout(event)">
            Esci dall'account
          </button>
        </div>
      `}
    </div>
  `;
}

/**
 * Idratazione Universale della Navbar
 */
function initUniversalNav() {
  const logged = VEX_AUTH.isLoggedIn();
  const user = VEX_AUTH.getUser();
  const saldoStr = VEX_AUTH.fmtEur(VEX_AUTH.getSaldo());

  // Rileva pagina corrente
  const path = window.location.pathname.toLowerCase();
  let currentPage = 'home';
  if (path.includes('dashboard')) currentPage = 'dashboard';
  else if (path.includes('comparatore')) currentPage = 'comparatore';
  else if (path.includes('tracking')) currentPage = 'tracking';
  else if (path.includes('portafoglio')) currentPage = 'portafoglio';
  else if (path.includes('impostazioni')) currentPage = 'impostazioni';
  else if (path.includes('notifiche')) currentPage = 'notifiche';
  else if (path.includes('checkout')) currentPage = 'checkout';
  else if (path.includes('assistenza')) currentPage = 'assistenza';

  // Sincronizza classe html per le regole CSS !important
  if (logged) {
    document.documentElement.classList.add('is-logged-in');
  } else {
    document.documentElement.classList.remove('is-logged-in');
  }

  // Toggle responsive display sezioni Guest vs Autenticato
  document.querySelectorAll('.nav-links-guest').forEach(el => {
    el.style.display = logged ? 'none' : '';
  });
  document.querySelectorAll('.nav-actions-guest').forEach(el => {
    el.style.display = logged ? 'none' : '';
  });

  document.querySelectorAll('.nav-links-auth').forEach(el => {
    el.style.display = logged ? '' : 'none';
  });
  document.querySelectorAll('.nav-actions-auth').forEach(el => {
    el.style.display = logged ? '' : 'none';
  });

  // Se loggato, popola i dati utente
  if (logged) {
    document.querySelectorAll('#nav-user-name, .nav-user-name').forEach(el => {
      el.textContent = user.displayName;
    });
    document.querySelectorAll('#nav-user-plan, .nav-user-plan').forEach(el => {
      el.textContent = user.piano;
    });
    document.querySelectorAll('#nav-dd-name, .nav-dd-name').forEach(el => {
      el.textContent = user.displayName;
    });
    document.querySelectorAll('#nav-dd-email, .nav-dd-email').forEach(el => {
      el.textContent = user.email;
    });
    document.querySelectorAll('#nav-saldo-val, .nav-saldo-val').forEach(el => {
      el.textContent = saldoStr;
    });

    // Iniziali avatar
    document.querySelectorAll('.nav-user-initials, .nav-dd-avatar').forEach(el => {
      el.textContent = user.initials;
    });

    // Gestione Notifiche Reali (nessuna notifica fittizia)
    const badge = document.getElementById('notif-badge');
    const notifPanel = document.getElementById('notif-panel');
    let userNotifs = [];
    try {
      userNotifs = JSON.parse(localStorage.getItem('vex_user_notifications') || '[]');
    } catch(e) {}
    const unreadCount = userNotifs.filter(n => !n.read).length;

    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }

    if (notifPanel && unreadCount === 0) {
      notifPanel.innerHTML = `
        <div class="px-3 pt-2.5 pb-2 flex justify-between items-center mb-1" style="border-bottom:1px solid #F3F4F6">
          <span class="text-xs font-bold text-gray-700">Notifiche</span>
        </div>
        <div class="py-8 px-4 text-center">
          <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <p class="text-xs font-medium text-gray-500 m-0">Nessuna nuova notifica</p>
        </div>
        <div class="p-2 border-t text-center" style="border-color:#F3F4F6">
          <a href="notifiche.html" class="text-xs font-semibold text-vexBlue hover:underline notif-all-link">Centro notifiche →</a>
        </div>
      `;
    }

    // Se loggato e presente VEX_API, aggiorna i dati in tempo reale dal server
    if (window.VEX_API && typeof window.VEX_API.getMe === 'function' && window.VEX_API.getToken()) {
      if (!window.__vex_me_fetching) {
        window.__vex_me_fetching = true;
        window.VEX_API.getMe().catch(err => {
          if (err && (err.message === 'unauthorized' || err.status === 401)) {
            console.warn('[Navbar] Token non valido o scaduto, logout in corso');
            VEX_AUTH.logout();
          }
        }).finally(() => {
          window.__vex_me_fetching = false;
        });
      }
    }
  }

  // Evidenzia link attivo
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    const pageTarget = link.getAttribute('data-nav');
    if (pageTarget && pageTarget === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Assicura che i link a "Tutte le notifiche" puntino a notifiche.html
  document.querySelectorAll('.notif-panel a, .notif-all-link').forEach(a => {
    if (a.textContent.includes('Tutte le notifiche')) {
      a.href = 'notifiche.html';
    }
  });

  // Drawer unificato
  ensureUniversalMobileDrawer(logged, user, saldoStr);
}

/**
 * Dropdown Utente
 */
function toggleNavUserDropdown(e) {
  if (e) e.stopPropagation();
  closeNavNotif();
  const btn = document.getElementById('nav-user-btn');
  const dd = document.getElementById('nav-user-dropdown');
  if (!btn || !dd) return;
  const isOpen = dd.classList.contains('open');
  if (isOpen) {
    closeNavUserDropdown();
  } else {
    dd.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function closeNavUserDropdown() {
  const btn = document.getElementById('nav-user-btn');
  const dd = document.getElementById('nav-user-dropdown');
  if (!btn || !dd) return;
  dd.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}

/**
 * Notifiche Panel
 */
function toggleNavNotif(e) {
  if (e) e.stopPropagation();
  closeNavUserDropdown();
  const btn = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  if (!btn || !panel) return;
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    closeNavNotif();
  } else {
    panel.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

function closeNavNotif() {
  const btn = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  if (!btn || !panel) return;
  panel.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}

function markAllNavNotifsRead() {
  document.querySelectorAll('.notif-item .notif-dot').forEach(dot => {
    dot.classList.add('read');
  });
  const badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';
  if (typeof showToast === 'function') {
    showToast('Tutte le notifiche segnate come lette');
  }
}

/**
 * Mobile Drawer / Menu
 */
function toggleNavMobileMenu() {
  const drawer = document.getElementById('mob-drawer');
  if (drawer) drawer.classList.toggle('open');
}

function closeNavMobileMenu() {
  const drawer = document.getElementById('mob-drawer');
  if (drawer) drawer.classList.remove('open');
}

// Retrocompatibilità globale per chiamate legacy
window.toggleDrawer = toggleNavMobileMenu;
window.closeDrawer = closeNavMobileMenu;
window.closeDrawerGo = function(url) {
  closeNavMobileMenu();
  if (url) window.location.href = url;
};
window.closeDrawerScroll = function(id) {
  closeNavMobileMenu();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

/**
 * Gestione Overlay Autenticazione Ospite nel Comparatore
 */
window.openGuestAuthModal = function(customCallback) {
  window._pendingCheckoutAction = customCallback || null;
  let modal = document.getElementById('modal-guest-auth');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-guest-auth';
    modal.className = 'guest-auth-modal';
    modal.innerHTML = `
      <div class="guest-auth-box">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
          <div>
            <span style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#0078FF;background:rgba(0,120,255,0.08);padding:4px 10px;border-radius:9999px;display:inline-block;margin-bottom:8px">Un ultimo passo</span>
            <h3 style="font-size:20px;font-weight:700;color:#0A0A0B;letter-spacing:-0.015em;margin:0">Accedi o Crea Account</h3>
          </div>
          <button type="button" onclick="closeGuestAuthModal()" style="width:32px;height:32px;border-radius:50%;background:#F3F4F6;border:1px solid #E5E7EB;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:#4B5563;line-height:1">&times;</button>
        </div>
        <p style="font-size:13.5px;color:#4B5563;line-height:1.5;margin:0 0 20px">
          Il tuo preventivo è pronto! Per salvare la spedizione e procedere al pagamento, accedi con il tuo account o registrati in 30 secondi.
        </p>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px">
          <a href="login.html" onclick="sessionStorage.setItem('vexone:return_url', 'checkout.html')" class="nav-btn-secondary" style="height:44px;font-size:13.5px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:12px">
            <svg style="width:16px;height:16px;color:#0078FF" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Accedi con la tua email
          </a>
          <a href="register.html" onclick="sessionStorage.setItem('vexone:return_url', 'checkout.html')" class="nav-btn-primary shine" style="height:44px;font-size:13.5px;font-weight:700;display:flex;align-items:center;justify-content:center;border-radius:12px">
            Crea nuovo account gratis →
          </a>
        </div>
        <div style="background:#F9FAFB;border:1px dashed #D1D5DB;border-radius:12px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px">
          <div>
            <p style="font-size:12px;font-weight:700;color:#111827;margin:0">Modalità Demo / Test</p>
            <p style="font-size:11px;color:#6B7280;margin:2px 0 0">Accedi all'istante come Damiano</p>
          </div>
          <button type="button" onclick="quickDemoLogin()" style="background:#0078FF;color:#fff;border:none;padding:7px 12px;border-radius:8px;font-size:11.5px;font-weight:700;cursor:pointer">Accedi subito</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeGuestAuthModal();
    });
  }
  modal.classList.add('open');
};

window.closeGuestAuthModal = function() {
  const modal = document.getElementById('modal-guest-auth');
  if (modal) modal.classList.remove('open');
};

window.quickDemoLogin = function() {
  VEX_AUTH.login('damiano@vexone.it');
  closeGuestAuthModal();
  if (typeof showToast === 'function') {
    showToast('Accesso effettuato! Reindirizzamento...');
  }
  setTimeout(() => {
    if (window._pendingCheckoutAction) {
      window._pendingCheckoutAction();
    } else {
      window.location.href = 'checkout.html';
    }
  }, 400);
};

// Global click-outside listener
document.addEventListener('click', function(e) {
  const userWrap = document.getElementById('nav-user-wrap');
  if (userWrap && !userWrap.contains(e.target)) {
    closeNavUserDropdown();
  }
  const notifWrap = document.getElementById('notif-wrap');
  if (notifWrap && !notifWrap.contains(e.target)) {
    closeNavNotif();
  }
});

// Global Escape listener
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeNavUserDropdown();
    closeNavNotif();
    closeNavMobileMenu();
    closeGuestAuthModal();
  }
});

// Esegui inizializzazione al caricamento
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUniversalNav);
} else {
  initUniversalNav();
}
