// UniUD eLearning Dark Theme — content script
// Gestisce elementi dinamici caricati dopo il DOM iniziale

(function () {
  'use strict';

  // Forza dark su elementi con background inline chiari
  function fixInlineStyles(node) {
    if (!node || node.nodeType !== 1) return;

    const bg = node.style.backgroundColor;
    const color = node.style.color;

    if (bg) {
      const light = isLightColor(bg);
      if (light) node.style.backgroundColor = '#2a2a2a';
    }

    if (color) {
      const dark = isDarkColor(color);
      if (dark) node.style.color = '#e0e0e0';
    }
  }

  function isLightColor(color) {
    const c = parseColor(color);
    if (!c) return false;
    // luminanza percettiva
    const lum = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    return lum > 200;
  }

  function isDarkColor(color) {
    const c = parseColor(color);
    if (!c) return false;
    const lum = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    return lum < 50;
  }

  function parseColor(color) {
    if (!color) return null;
    // rgb(r, g, b)
    const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgb) return [+rgb[1], +rgb[2], +rgb[3]];
    // #ffffff o #fff
    const hex6 = color.match(/^#([0-9a-f]{6})$/i);
    if (hex6) {
      const h = hex6[1];
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    }
    const hex3 = color.match(/^#([0-9a-f]{3})$/i);
    if (hex3) {
      const h = hex3[1];
      return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)];
    }
    // named
    if (color === 'white' || color === '#fff' || color === '#ffffff') return [255,255,255];
    if (color === 'black' || color === '#000' || color === '#000000') return [0,0,0];
    return null;
  }

  // Scansiona il documento per inline styles problematici
  function scanAll() {
    document.querySelectorAll('[style]').forEach(fixInlineStyles);
  }

  // MutationObserver per contenuti dinamici (es. modali, lazy-load)
  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          fixInlineStyles(node);
          node.querySelectorAll && node.querySelectorAll('[style]').forEach(fixInlineStyles);
        }
      }
      // attributo style modificato dinamicamente
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        fixInlineStyles(mutation.target);
      }
    }
  });

  // Avvia quando il DOM è pronto
  function init() {
    scanAll();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
