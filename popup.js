const toggle = document.getElementById('toggle');
const label = document.getElementById('status-label');

chrome.storage.local.get(['enabled'], (res) => {
  const on = res.enabled !== false;
  toggle.checked = on;
  label.textContent = on ? 'Dark theme attivo' : 'Dark theme disattivo';
});

toggle.addEventListener('change', () => {
  const on = toggle.checked;
  chrome.storage.local.set({ enabled: on });
  label.textContent = on ? 'Dark theme attivo' : 'Dark theme disattivo';
});
