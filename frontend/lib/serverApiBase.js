const DEFAULT_PROD_API_BASE = 'https://absence-backend.up.railway.app';
const DEFAULT_DEV_API_BASE = 'http://localhost:5000';

function removeTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function sanitizeApiBase(rawValue) {
  if (!rawValue) return '';

  let value = String(rawValue).trim();
  if (!value) return '';

  value = removeTrailingSlash(value);
  value = value.replace(/\/api$/i, '');

  if (value.startsWith('.')) {
    value = value.slice(1);
  }

  if (/^https?:\/\/\./i.test(value)) {
    value = value.replace(/^https?:\/\/\./i, (match) => match.replace('//.', '//'));
  }

  return value;
}

export function getServerApiBase() {
  const fromEnv = sanitizeApiBase(process.env.NEXT_PUBLIC_API_URL);
  if (fromEnv) return fromEnv;

  return process.env.NODE_ENV === 'development' ? DEFAULT_DEV_API_BASE : DEFAULT_PROD_API_BASE;
}

