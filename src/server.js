const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const { analyzePrompt } = require('./rules');

const app = express();
app.use(helmet());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.post('/v1/secure-prompt', (req, res) => {
  const { user_id, text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text required' });

  const result = analyzePrompt(text);

  if (result.status === 'blocked') {
    return res.json({
      status: 'blocked',
      reason: result.reason,
      matched: result.matched || null
    });
  }

  return res.json({
    status: 'allowed',
    sanitized_text: result.sanitized || text
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Secure Prompt Gate running on ${port}`));

module.exports = app;
