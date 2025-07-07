const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const code = ' ';

oAuth2Client.getToken(code).then(({ tokens }) => {
  console.log('Refresh Token :', tokens.refresh_token);
}).catch((err) => {
  console.error('Erreur :', err.response?.data || err);
});