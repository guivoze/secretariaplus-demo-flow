// Utilitário para sanitizar dados e remover valores "null" como string
export const sanitizeValue = (value: any): string => {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return '';
  }
  return String(value).trim();
};

// Utilitário para exibir valores com fallback
export const displayValue = (value: any, fallback: string = '-'): string => {
  const sanitized = sanitizeValue(value);
  return sanitized || fallback;
};
