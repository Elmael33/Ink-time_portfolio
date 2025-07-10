document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/api/appointments');
  const data = await res.json();

  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  data.forEach(rdv => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td data-label="Client">${rdv.name}</td>
      <td data-label="Date">${formatDate(rdv.date)} ${rdv.heure}</td>
      <td data-label="Email"><a href="mailto:${rdv.email}">${rdv.email}</a></td>
      <td data-label="Description">${rdv.message}</td>
      <td data-label="Fichier">
        ${rdv.file ? `<a href="/uploads/${rdv.file}" download>${rdv.file}</a>` : '—'}
      </td>
      <td data-label="Actions" class="actions">
        <button class="validate" data-id="${rdv.id}">Valider</button>
        <button class="delete" data-id="${rdv.id}">Supprimer</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Actions
  document.querySelectorAll('.delete').forEach(btn =>
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (confirm("Confirmer suppression ?")) {
        const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        if (res.ok) location.reload();
        else alert("Erreur suppression");
      }
    })
  );

  document.querySelectorAll('.validate').forEach(btn =>
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      alert(`RDV ${id} validé ✅`);
      // Tu peux ici faire un PUT si tu veux stocker la validation en DB plus tard
    })
  );
});

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR');
}
