const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('Code manquant');

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('✅ TOKENS:', tokens);

    // 👉 Affiche-les pour les copier-coller dans .env
    res.send(`
      <h2>Access Token</h2><pre>${tokens.access_token}</pre>
      <h2>Refresh Token</h2><pre>${tokens.refresh_token}</pre>
    `);
  } catch (err) {
    console.error('❌ Erreur lors de l’échange du code :', err);
    res.status(500).send('Erreur lors de l’échange du code');
  }
});

module.exports = router;