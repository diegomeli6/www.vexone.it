/**
 * VEX ONE — Client API Universale (FastAPI Backend)
 * Connette il frontend al backend di produzione: https://vexhost.duckdns.org
 */

const VEX_API = (function() {
  'use strict';

  // Endpoint di produzione FastAPI
  const BASE_URL = 'https://vexhost.duckdns.org';
  const TOKEN_KEY = 'vexone_access_token';
  const USER_KEY = 'vexone:user:v1';
  const AUTH_FLAG = 'vexone_logged_in';
  const AUTH_V1 = 'vexone:auth:v1';

  /**
   * Helper per recuperare il token salvato
   */
  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * Helper per salvare il token
   */
  function setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(AUTH_FLAG, 'true');
        localStorage.setItem(AUTH_V1, 'true');
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_FLAG);
        localStorage.removeItem(AUTH_V1);
        localStorage.removeItem(USER_KEY);
      }
    } catch (e) {}
  }

  /**
   * Wrapper universale per chiamate fetch con gestione automatica di headers e 401
   */
  async function request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = options.headers || {};
    const token = getToken();

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    let response;
    try {
      response = await fetch(url, config);
    } catch (networkErr) {
      console.error('[VEX_API] Errore di rete:', networkErr);
      throw new Error('Impossibile contattare il server VexONE. Verifica la connessione.');
    }

    // Gestione Sessione Scaduta (401)
    if (response.status === 401 && !url.includes('/users/login')) {
      console.warn('[VEX_API] Sessione scaduta o non valida (401).');
      setToken(null);
      window.dispatchEvent(new CustomEvent('vex:session-expired'));
      if (typeof window.showToast === 'function') {
        window.showToast('Sessione scaduta. Effettua nuovamente l\'accesso.', 'error');
      }
      throw new Error('unauthorized');
    }

    // Estrazione payload JSON o testo
    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    } else {
      data = await response.text().catch(() => '');
    }

    if (!response.ok) {
      const errorMsg = data && (data.detail || data.message || data.errormessage)
        ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail))
        : `Errore HTTP ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  /* ══════════════════════════════════════════════
     METODI AUTH & PROFILO UTENTE
     ══════════════════════════════════════════════ */

  /**
   * Login utente
   * @param {string} username - Email dell'utente
   * @param {string} password - Password
   * @returns {Promise<{access_token: string, token_type: string}>}
   */
  async function login(username, password) {
    const formData = new FormData();
    formData.append('username', username.trim());
    formData.append('password', password);

    const res = await request('/users/login', {
      method: 'POST',
      body: formData
    });

    if (res && res.access_token) {
      setToken(res.access_token);
      // Sincronizza immediatamente il profilo utente reale
      try {
        await getMe();
      } catch (err) {
        console.warn('[VEX_API] Caricamento profilo post-login differito:', err);
      }
    }

    return res;
  }

  /**
   * Registrazione nuovo utente
   * @param {Object} userData - { email, password, firstName, lastName, phone }
   */
  async function register(userData) {
    const payload = {
      email: userData.email.trim(),
      password: userData.password,
      info: {
        name: (userData.firstName || '').trim(),
        surname: (userData.lastName || '').trim(),
        phone: (userData.phone || '').trim()
      }
    };

    const res = await request('/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res;
  }

  /**
   * Recupera il profilo dell'utente autenticato
   */
  async function getMe() {
    const user = await request('/users/me', { method: 'GET' });

    if (user) {
      const firstName = user.profile?.first_name || user.info?.name || user.name || '';
      const lastName = user.profile?.last_name || user.info?.surname || user.surname || '';
      const fullName = `${firstName} ${lastName}`.trim() || user.email || 'Utente VexONE';
      
      const creditVal = (user.profile && user.profile.credit !== undefined && user.profile.credit !== '') 
        ? parseFloat(user.profile.credit) 
        : (typeof user.credit === 'number' ? user.credit : (parseFloat(user.credit) || 0));
      const creditNum = isNaN(creditVal) ? 0 : creditVal;
      
      const plan = user.profile?.plan || user.plan || (user.type === 'admin' ? 'VEX Admin' : 'VEX Base');

      let savedAddr = null;
      try {
        const rawAddr = localStorage.getItem('vexone_user_address');
        if (rawAddr) savedAddr = JSON.parse(rawAddr);
      } catch(e) {}

      const defAddr = user.default_address || 
        (user.info?.address && (Array.isArray(user.info.address) ? user.info.address[0] : user.info.address)) || 
        user.vat_address || 
        savedAddr || 
        {};

      const street = defAddr.address || defAddr.street || defAddr.via || '';
      const num = defAddr.number || defAddr.num || defAddr.civico || '';
      const cap = defAddr.zip_code || defAddr.cap || defAddr.zip || '';
      const city = defAddr.city || defAddr.citta || '';
      const pr = (defAddr.province || defAddr.pr || '').toUpperCase();

      const userObj = {
        name: fullName,
        nome: firstName,
        cognome: lastName,
        first_name: firstName,
        last_name: lastName,
        displayName: fullName,
        email: user.email || '',
        phone: user.profile?.phone || user.info?.phone || '',
        company: user.profile?.company || user.info?.company || '',
        vatNumber: user.profile?.vat_number || user.info?.vat_number || '',
        plan: plan,
        piano: plan,
        saldo: `€ ${creditNum.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        creditRaw: creditNum,
        type: user.type || 'user',
        via: street,
        address: street,
        num: num,
        cap: cap,
        zip_code: cap,
        city: city,
        pr: pr,
        province: pr,
        default_address: {
          address: street,
          street: street,
          via: street,
          number: num,
          num: num,
          zip_code: cap,
          cap: cap,
          city: city,
          province: pr,
          pr: pr
        },
        raw: user
      };

      try {
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));
        localStorage.setItem('vexone:wallet:saldo:v1', creditNum.toFixed(2));
        localStorage.setItem('vexone_user_profile', JSON.stringify(userObj));
        localStorage.setItem('vexone_user_email', user.email || '');
      } catch (e) {}

      // Aggiorna navbar in tempo reale se presente la funzione
      if (typeof window.initUniversalNav === 'function') {
        window.initUniversalNav();
      }
    }

    return user;
  }

  /**
   * Aggiorna profilo utente
   */
  async function updateMe(profileData) {
    const res = await request('/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    await getMe();
    return res;
  }

  /**
   * Cambio password
   */
  async function changePassword(currentPassword, newPassword) {
    return await request('/users/me/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    });
  }

  /**
   * Richiesta recupero password
   */
  async function forgotPassword(email) {
    return await request('/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() })
    });
  }

  /**
   * Logout universale
   */
  function logout() {
    setToken(null);
    if (typeof window.initUniversalNav === 'function') {
      window.initUniversalNav();
    }
  }

  /* ══════════════════════════════════════════════
     METODI PREVENTIVI & TARIFFE CORRIERI
     ══════════════════════════════════════════════ */

  /**
   * Richiede il preventivo reale a tutti i corrieri integrati
   * @param {Object} quotationData - { dettagli, colli, mittente, destinatario }
   */
  async function getQuotation(quotationData) {
    return await request('/quotations/quotation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotationData)
    });
  }

  /**
   * Creazione rapida ordine di spedizione
   */
  async function createOrder(orderData) {
    return await request('/quotations/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
  }

  /* ══════════════════════════════════════════════
     METODI TRACKING & SPEDIZIONI
     ══════════════════════════════════════════════ */

  /**
   * Traccia spedizione tramite codice
   * @param {string} code - Codice tracking (es. VEX-123456)
   */
  async function track(code) {
    if (!code) throw new Error('Codice tracking non specificato');
    return await request(`/shipments/track/${encodeURIComponent(code.trim())}`, {
      method: 'GET'
    });
  }

  /**
   * Elenco spedizioni dell'utente autenticato
   */
  async function getShipments() {
    return await request('/shipments/', { method: 'GET' });
  }

  /**
   * Dettaglio singola spedizione
   */
  async function getShipment(shipmentId) {
    return await request(`/shipments/${shipmentId}`, { method: 'GET' });
  }

  /* ══════════════════════════════════════════════
     METODI PORTAFOGLIO & RICARICHE
     ══════════════════════════════════════════════ */

  /**
   * Elenco richieste di ricarica
   */
  async function getTopups() {
    return await request('/users/topups', { method: 'GET' });
  }

  /**
   * Genera causale per ricarica con bonifico
   */
  async function generateRechargeCausale(amount) {
    return await request('/users/recharge-causale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount) })
    });
  }

  /**
   * Invia richiesta di ricarica conto
   */
  async function recharge(amount, method, txId) {
    return await request('/users/recharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(amount),
        method: method || 'stripe',
        tx_id: txId || ''
      })
    });
  }

  /**
   * Verifica validità coupon promozionale
   */
  async function checkCoupon(couponCode) {
    if (!couponCode) return { valid: false, message: 'Codice non valido' };
    return await request('/quotations/checkcoupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coupon_code: couponCode.trim().toUpperCase() })
    });
  }

  // Interfaccia pubblica esposta
  return {
    BASE_URL,
    getToken,
    setToken,
    login,
    register,
    getMe,
    updateMe,
    changePassword,
    forgotPassword,
    logout,
    getQuotation,
    createOrder,
    track,
    getShipments,
    getShipment,
    getTopups,
    listTopups: getTopups,
    generateRechargeCausale,
    recharge,
    rechargeAccount: recharge,
    checkCoupon
  };
})();

// Esporta globalmente
window.VEX_API = VEX_API;
