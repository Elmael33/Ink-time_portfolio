import { useState } from 'react';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Ajuster pour que lundi soit 0
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    // Jours vides du mois précédent
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handleDateClick = (day) => {
    if (day) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(dateString);
      
      // Déclencher l'événement pour notifier la page parent
      window.dispatchEvent(new CustomEvent('dateSelected', {
        detail: { date: dateString }
      }));
    }
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return selectedDate === dateString;
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const today = new Date();
    const dateToCheck = new Date(currentYear, currentMonth, day);
    today.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header avec navigation */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <button 
          onClick={() => navigateMonth('prev')}
          className="hover:bg-blue-700 rounded-full p-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-lg font-semibold">
          {months[currentMonth]} {currentYear}
        </h2>
        
        <button 
          onClick={() => navigateMonth('next')}
          className="hover:bg-blue-700 rounded-full p-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              h-12 border-r border-b border-gray-200 flex items-center justify-center text-sm
              ${day ? 'cursor-pointer hover:bg-blue-50' : ''}
              ${isToday(day) ? 'bg-blue-100 font-bold text-blue-600' : ''}
              ${isSelected(day) ? 'bg-blue-600 text-white' : ''}
              ${isPastDate(day) ? 'text-gray-400 cursor-not-allowed' : ''}
              ${day && !isPastDate(day) ? 'hover:bg-blue-50' : ''}
            `}
            onClick={() => !isPastDate(day) && handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Affichage de la date sélectionnée */}
      {selectedDate && (
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            Date sélectionnée: <span className="font-semibold text-blue-600">{selectedDate}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;