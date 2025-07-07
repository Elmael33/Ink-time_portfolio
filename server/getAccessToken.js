const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

oauth2Client.getAccessToken().then(res => {
  console.log('✅ ACCESS TOKEN :', res.token);
}).catch(err => {
  console.error('❌ Impossible de récupérer l’access_token :', err);
});