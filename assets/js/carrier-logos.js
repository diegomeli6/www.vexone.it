/**
 * VEX ONE - Carrier Logos Engine
 * Mirrors the carrier matching, SVG resolution, and logo badges from _vecchio_sito_next.
 */
(function(window) {
  'use strict';

  const CARRIER_CATALOG = [
    { match: /dva[\s_-]?lm|dvalm|last\s*minute/i, slug: 'dvalm', label: 'Vex Last Minute', bg: '#0A0A0B', color: '#B8FF00' },
    { match: /dva|vex/i, slug: 'dva', label: 'VEX', bg: '#0A0A0B', color: '#B8FF00' },
    { match: /inpost/i, slug: 'inpost', label: 'InPost', bg: '#FFCB04', color: '#3B3A35' },
    { match: /sda/i, slug: 'sda', label: 'SDA', bg: '#FCD500', color: '#0A0A0B' },
    { match: /gls/i, slug: 'gls', label: 'GLS', bg: '#061AB1', color: '#FFD200' },
    { match: /dhl/i, slug: 'dhl', label: 'DHL', bg: '#FFCC00', color: '#D40511' },
    { match: /brt|bartolini/i, slug: 'brt', label: 'BRT', bg: '#E30613', color: '#FFFFFF' },
    { match: /ups/i, slug: 'ups', label: 'UPS', bg: '#351C15', color: '#FFB500' },
    { match: /fedex/i, slug: 'fedex', label: 'FedEx', bg: '#4D148C', color: '#FF6600' },
    { match: /tnt/i, slug: 'tnt', label: 'TNT', bg: '#FF6600', color: '#FFFFFF' },
    { match: /poste|pdb/i, slug: 'poste', label: 'Poste', bg: '#0066CC', color: '#FFD800' }
  ];

  function getCarrierBrand(name) {
    if (!name) return null;
    const str = String(name).trim();
    for (const item of CARRIER_CATALOG) {
      if (item.match.test(str)) return item;
    }
    return null;
  }

  function getCarrierIconPath(name) {
    const b = getCarrierBrand(name);
    return b ? `carriers/${b.slug}.svg` : null;
  }

  function displayCarrierName(name) {
    if (!name) return '';
    let str = String(name);
    str = str.replace(/\bDVA[\s_-]?LM\b/gi, 'Vex Last Minute');
    str = str.replace(/\bDVALM\b/gi, 'Vex Last Minute');
    str = str.replace(/\bDVA\b/gi, 'VEX');
    return str;
  }

  function getCarrierInitials(name) {
    const clean = displayCarrierName(name).replace(/[^A-Za-z0-9]/g, '');
    return clean.slice(0, 3).toUpperCase() || '?';
  }

  function getCarrierLogoHtml(name, size = 32, withName = false, className = '') {
    const b = getCarrierBrand(name);
    const iconPath = b ? `carriers/${b.slug}.svg` : null;
    const label = b ? b.label : displayCarrierName(name);
    const initials = getCarrierInitials(name);
    const bg = b ? b.bg : '#F3F4F6';
    const color = b ? b.color : '#0A0A0B';

    const imgHtml = iconPath
      ? `<img src="${iconPath}" width="${size}" height="${size}" alt="${label}" class="carrier-logo-icon" style="width:${size}px;height:${size}px" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='inline-flex'">`
      : '';

    const fallbackHtml = `<span class="carrier-logo-fallback" style="display:${iconPath ? 'none' : 'inline-flex'};width:${size}px;height:${size}px;font-size:${Math.max(9, Math.round(size * 0.28))}px;background:${bg};color:${color}">${initials}</span>`;

    if (withName) {
      return `<span class="carrier-logo-wrap carrier-logo-wrap-named ${className}">${imgHtml}${fallbackHtml}<span class="carrier-logo-name">${label}</span></span>`;
    }
    return `<span class="carrier-logo-wrap ${className}">${imgHtml}${fallbackHtml}</span>`;
  }

  window.VEX_CARRIER_LOGOS = {
    CATALOG: CARRIER_CATALOG,
    getBrand: getCarrierBrand,
    getIconPath: getCarrierIconPath,
    displayName: displayCarrierName,
    getInitials: getCarrierInitials,
    getLogoHtml: getCarrierLogoHtml
  };

})(window);
