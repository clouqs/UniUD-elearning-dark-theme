// ==== UniUD Dark Theme Debugger ====
// Incolla questo nella Console di DevTools (F12) su elearning.uniud.it
// Poi copia l'output e mandamelo

(function () {
  const selectors = [
    // Modal / login
    '.login-container',
    '.login-main',
    '.modal-content',
    '.modal-header',
    '.modal-body',
    '.modal-footer',
    '.generalbox',
    '.box',

    // Activity header
    '.activity-header',
    '.activity-information',
    '.activity-dates',
    '.activity-description',
    '.no-overflow',

    // Quiz / qtext
    '.qtext',
    '.que',
    '.formulation',
    '.ablock',
    '.answer',
    '.control',
    'select.custom-select',
    'select.select',
    '.correct',
    '.incorrect',
    '.text-success',
    '.text-danger',

    // Generici potenzialmente problematici
    '.generalbox',
    '.box.py-3',
    '[role="alertdialog"]',
    '[role="alert"]',
    '.singlebutton',
  ];

  const results = [];
  const seen = new Set();

  selectors.forEach(sel => {
    const els = document.querySelectorAll(sel);
    els.forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);

      const computed = window.getComputedStyle(el);
      const bg = computed.backgroundColor;
      const color = computed.color;
      const border = computed.borderColor;
      const inlineStyle = el.getAttribute('style') || '';
      const classes = el.className;

      // Filtra solo quelli con colori chiari (potenzialmente problematici)
      const isLight = isLightBg(bg);
      const isDarkText = isDarkTextColor(color);

      if (isLight || isDarkText) {
        results.push({
          selector: sel,
          tag: el.tagName.toLowerCase(),
          classes: typeof classes === 'string' ? classes.split(' ').filter(Boolean).join(' ') : '',
          bg,
          color,
          border,
          inlineStyle: inlineStyle || '(none)',
          isLightBg: isLight,
          isDarkText: isDarkText,
        });
      }
    });
  });

  function isLightBg(color) {
    const c = parseRgb(color);
    if (!c) return false;
    return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) > 180;
  }

  function isDarkTextColor(color) {
    const c = parseRgb(color);
    if (!c) return false;
    return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) < 80;
  }

  function parseRgb(str) {
    if (!str) return null;
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
  }

  if (results.length === 0) {
    console.log('%c✅ Nessun elemento problematico trovato con questi selettori.', 'color: #4caf50; font-weight: bold');
    return;
  }

  console.log(`%c🔍 UniUD Dark Debugger — ${results.length} elementi problematici trovati:`, 'color: #4e9de8; font-size: 14px; font-weight: bold');
  console.log('');

  results.forEach((r, i) => {
    console.groupCollapsed(`${i + 1}. <${r.tag}> .${r.classes.split(' ')[0] || '?'} — bg: ${r.bg} | color: ${r.color}`);
    console.log('Selector match:', r.selector);
    console.log('Classes:       ', r.classes);
    console.log('BG color:      ', r.bg, r.isLightBg ? '⚠️ CHIARO' : '');
    console.log('Text color:    ', r.color, r.isDarkText ? '⚠️ SCURO' : '');
    console.log('Border:        ', r.border);
    console.log('Inline style:  ', r.inlineStyle);
    console.groupEnd();
  });

  // Output compatto copiabile
  const summary = results.map(r =>
    `[${r.tag}] .${r.classes.replace(/\s+/g, '.')} | bg: ${r.bg} | color: ${r.color}${r.inlineStyle !== '(none)' ? ' | inline: ' + r.inlineStyle : ''}`
  ).join('\n');

  console.log('');
  console.log('%c📋 COPIA QUESTO E MANDAMELO:', 'color: #e0a135; font-weight: bold; font-size: 13px');
  console.log(summary);

  // Evidenzia visivamente gli elementi sul sito
  results.forEach(r => {
    document.querySelectorAll(r.selector).forEach(el => {
      el.style.outline = '2px solid red';
      el.style.outlineOffset = '-2px';
    });
  });

  console.log('%c🟥 Gli elementi problematici sono stati evidenziati in rosso sulla pagina.', 'color: #e05252');
})();
