const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/generate', async (req, res) => {
  const { patientName, insurance, service, denialReason, notes } = req.body;

  try {
   const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Write a professional insurance appeal letter for:
Patient Name: ${patientName}
Insurance Company: ${insurance}
Service denied: ${service}
Reason for denial: ${denialReason}
Additional notes: ${notes}`
    }]
  })
});
    const data = await response.json();
    console.log('API response:', JSON.stringify(data));
res.json({ letter: data.content?.[0]?.text || data.error?.message || 'Error generating letter' });
  } catch (error) {
console.log('CATCH ERROR:', error.message); res.json({ letter: 'Error: ' + error.message });  }
});

app.listen(3000, () => {
  console.log('AppealaRx running on http://localhost:3000');
});