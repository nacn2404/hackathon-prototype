# Secure AI Prompt-Gate

## Overview
A middleware microservice that detects and neutralizes prompt-injection and PII leaks before requests reach the Career Coach LLM.

## Run (local)
1. npm install
2. npm start
3. POST to http://localhost:3000/v1/secure-prompt

## API
POST /v1/secure-prompt
Body: { "user_id": "string", "text": "string" }
Response: { "status":"allowed"|"blocked", "reason": "string", "sanitized_text": "string|null" }

## AI usage & provenance
"AI tools are welcomed and expected. Disclose what you used and where. Undisclosed AI use is a disqualification offence."

Tools used: Claude (Anthropic) — project planning, architecture design, and code generation. Gemini, Duck.ai — research and concept exploration.

## Tests
npm test

## Notes
- Do not store real PII in logs or repo.
- Provide demo curl examples here.
