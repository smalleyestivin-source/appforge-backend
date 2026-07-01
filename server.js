require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

global.sessions = new Map();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.options('*', cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

app.post('/api/session', (req, res) => {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  global.sessions.set(token, { token, createdAt: Date.now() });
  res.json({ token, expiresIn: 86400 });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', version: '5.0.0', uptime: process.uptime() });
});

app.get('/api/build/:sessionId/status', (req, res) => {
  res.json({ ready: false, message: 'Build en proceso' });
});

app.listen(PORT, () => {
  console.log('AppForge Backend corriendo en puerto ' + PORT);
});
