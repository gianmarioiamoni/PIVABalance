import DOMPurify from 'dompurify';

// Sanitize HTML content with strict configuration
export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    return html; // Return as-is on server-side
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target="_blank"', 'rel="noopener noreferrer"'],
    FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick']
  });
};

// Sanitize user input (removes all HTML)
export const sanitizeInput = (input: string): string => {
  if (typeof window === 'undefined') {
    return input; // Return as-is on server-side
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [] // Remove all attributes
  });
};

// URL sanitization with validation
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove dangerous protocols
  const sanitized = url.replace(/^(?!(?:http|https|mailto|tel|sms):).*$/i, '');
  
  // Remove any potential script injection
  return sanitized.replace(/[<>"'`]/g, '');
};

// Escape HTML special characters
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Validate and sanitize JSON input
export const sanitizeJSON = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch {
    return '';
  }
};

// Content Security Policy Headers
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' http://localhost:5000",
    "font-src 'self' data:",
    "object-src 'none'",
    "media-src 'none'",
    "frame-src 'none'"
  ].join('; ')
};

// Utility per validare URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
