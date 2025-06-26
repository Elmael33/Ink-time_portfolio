async function postData(url = '', data = {}) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error('Erreur POST:', err);
    return null;
  }
}

// Exemple : fonction globale pour redirection après délai
function redirectAfter(url, delay = 1500) {
  setTimeout(() => {
    window.location.href = url;
  }, delay);
}

// Exemple : fonction pour afficher une notification simple
function showNotification(message, type = 'info') {
  const div = document.createElement('div');
  div.className = `notification ${type}`;
  div.textContent = message;
  document.body.prepend(div);
  setTimeout(() => div.remove(), 3000);
}