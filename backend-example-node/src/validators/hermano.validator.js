const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{9,15}$/;
const POSTAL_CODE_REGEX = /^\d{5}$/;
const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

function normalizeString(value) {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
}

function isValidDni(value) {
  const raw = normalizeString(value).toUpperCase();
  const match = raw.match(/^(\d{8})([A-HJ-NP-TV-Z])$/);
  if (!match) {
    return false;
  }

  const number = Number(match[1]);
  return DNI_LETTERS[number % 23] === match[2];
}

function isValidIban(value) {
  const raw = normalizeString(value).replace(/\s+/g, '').toUpperCase();
  if (!raw) {
    return true;
  }

  if (!IBAN_REGEX.test(raw)) {
    return false;
  }

  const rearranged = `${raw.slice(4)}${raw.slice(0, 4)}`;
  let expanded = '';

  for (const char of rearranged) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      expanded += String(code - 55);
    } else {
      expanded += char;
    }
  }

  let remainder = 0;
  for (const digit of expanded) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
}

function validateHermanoPayload(payload) {
  const errors = [];

  const requiredFields = ['nombre', 'primer_apellido', 'dni'];
  for (const field of requiredFields) {
    if (!normalizeString(payload[field])) {
      errors.push({ field, message: `${field} es obligatorio` });
    }
  }

  if (payload.dni && !isValidDni(payload.dni)) {
    errors.push({ field: 'dni', message: 'DNI invalido' });
  }

  if (payload.email && !EMAIL_REGEX.test(normalizeString(payload.email))) {
    errors.push({ field: 'email', message: 'Email invalido' });
  }

  const phoneFields = ['telefono', 'telefono_movil', 'telefono_fijo'];
  for (const field of phoneFields) {
    if (payload[field] && !PHONE_REGEX.test(normalizeString(payload[field]))) {
      errors.push({ field, message: `${field} no tiene un formato valido` });
    }
  }

  if (payload.codigo_postal && !POSTAL_CODE_REGEX.test(normalizeString(payload.codigo_postal))) {
    errors.push({ field: 'codigo_postal', message: 'Codigo postal invalido' });
  }

  if (payload.iban && !isValidIban(payload.iban)) {
    errors.push({ field: 'iban', message: 'IBAN invalido' });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateHermanoPayload
};
