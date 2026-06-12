const KEYWORDS = [
  /ignore (previous|all) instructions?/i,
  /forget (your|the) (role|persona)/i,
  /act as (an |a )?[a-z]+/i,
  /system override/i,
  /run the following/i,
  /execute this/i
];

// PII patterns: email, simple API key pattern (e.g., AKIA...), SSN-ish
const PII_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i,
  /\bAKIA[0-9A-Z]{16}\b/, // aws key style
  /\b\d{3}-\d{2}-\d{4}\b/ // SSN-like
];

function containsStructuralBreak(text) {
  const breakers = ['</user_input>', '<system>', '</system>', '<assistant>'];
  return breakers.some(b => text.toLowerCase().includes(b));
}

function keywordMatch(text) {
  for (const re of KEYWORDS) {
    if (re.test(text)) return re.toString();
  }
  return null;
}

function piiMatch(text) {
  for (const re of PII_PATTERNS) {
    if (re.test(text)) return re.toString();
  }
  return null;
}

function maskPII(text) {
  let out = text;
  out = out.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi, '[REDACTED_EMAIL]');
  out = out.replace(/\bAKIA[0-9A-Z]{16}\b/g, '[REDACTED_KEY]');
  out = out.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]');
  return out;
}

function analyzePrompt(text) {
  if (containsStructuralBreak(text)) {
    return { status: 'blocked', reason: 'structural_break', matched: '</user_input or system tag detected' };
  }
  const kw = keywordMatch(text);
  if (kw) {
    return { status: 'blocked', reason: 'keyword_heuristic', matched: kw };
  }
  const pii = piiMatch(text);
  if (pii) {
    const masked = maskPII(text);
    return { status: 'blocked', reason: 'pii_detected', matched: pii, sanitized: masked };
  }
  // passed all checks
  return { status: 'allowed' };
}

module.exports = { analyzePrompt };
