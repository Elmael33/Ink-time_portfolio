document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('appointmentsBody');

  try {
    const res = await fetch('/api/appointments');
    const data = await res.json();

    data.forEach(appointment => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${appointment.name}</td>
        <td>${appointment.email}</td>
        <td>${new Date(appointment.date).toLocaleDateString()}</td>
        <td>${appointment.heure.slice(0, 5)}</td>
        <td>${appointment.message || ''}</td>
        <td>${appointment.status}</td>
        <td>
          <button class="validate-btn" data-id="${appointment.id}" ${appointment.status === 'confirme' ? 'disabled' : ''}>Valider</button>
          <button class="delete-btn" data-id="${appointment.id}">Supprimer</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Gére les clics
    document.querySelectorAll('.validate-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        try {
          const res = await fetch(`/api/appointments/${id}/validate`, { method: 'PUT' });
          const result = await res.json();
          alert(result.message || 'RDV validé');
          location.reload();
        } catch (err) {
          alert('Erreur validation');
        }
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        if (!confirm('Supprimer ce rendez-vous ?')) return;

        try {
          const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
          const result = await res.json();
          alert(result.message || 'Supprimé');
          location.reload();
        } catch (err) {
          alert('Erreur suppression');
        }
      });
    });
  } catch (err) {
    console.error('Erreur chargement RDV:', err);
  }
});
