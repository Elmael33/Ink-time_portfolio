const { createEvent } = require('./utils/calendarService');

(async () => {
  try {
    const event = await createEvent({
      summary: 'Test Event',
      description: 'Test via script',
      start: new Date(Date.now() + 3600000).toISOString(),  // dans 1h
      end: new Date(Date.now() + 7200000).toISOString(),    // dans 2h
    });
    console.log('✅ Event créé :', event.htmlLink);
  } catch (err) {
    console.error('❌ Erreur création event :', err);
  }
})();