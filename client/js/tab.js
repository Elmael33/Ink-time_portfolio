const calendarGrid = document.getElementById('calendarGrid');
const weekDatesDiv = document.getElementById('weekDates');
let selectedDate = null;
let selectedTime = null;

const timeSlots = generateTimeSlots("08:00", "18:00", 100); // chaque 30 min
let currentWeekOffset = 0;

function generateTimeSlots(start, end, intervalMinutes) {
  const slots = [];
  let [sh, sm] = start.split(":").map(Number);
  let [eh, em] = end.split(":").map(Number);
  let date = new Date();
  date.setHours(sh, sm, 0, 0);
  const endDate = new Date();
  endDate.setHours(eh, em, 0, 0);
  while (date <= endDate) {
    slots.push(date.toTimeString().slice(0, 5));
    date.setMinutes(date.getMinutes() + intervalMinutes);
  }
  return slots;
}

function generateWeek(offset = 0) {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1 + offset * 7); // Lundi
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function renderWeek() {
  const days = generateWeek(currentWeekOffset);
  weekDatesDiv.innerHTML = '';
  calendarGrid.innerHTML = '';

  days.forEach(day => {
    const label = day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    const col = document.createElement('div');
    col.className = 'day-col';

    const header = document.createElement('h4');
    header.textContent = label;
    col.appendChild(header);

    timeSlots.forEach(time => {
      const btn = document.createElement('button');
      btn.className = 'time-btn';
      btn.textContent = time;

      const dateString = day.toISOString().split("T")[0];
      btn.addEventListener('click', () => {
        selectedDate = dateString;
        selectedTime = time;
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // Remplir le formulaire si besoin
        const dateInput = document.querySelector('input[name="date"]');
        const timeInput = document.querySelector('input[name="heure"]');
        if (dateInput && timeInput) {
          dateInput.value = dateString;
          timeInput.value = time;
        }

        console.log(`RDV sélectionné: ${dateString} à ${time}`);
      });

      col.appendChild(btn);
    });

    calendarGrid.appendChild(col);

    const dateLabel = document.createElement('div');
    dateLabel.textContent = label;
    dateLabel.style.flex = "1";
    weekDatesDiv.appendChild(dateLabel);
  });
}

document.getElementById('prevWeek').addEventListener('click', () => {
  currentWeekOffset--;
  renderWeek();
});

document.getElementById('nextWeek').addEventListener('click', () => {
  currentWeekOffset++;
  renderWeek();
});

renderWeek();