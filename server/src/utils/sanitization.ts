import validator from 'validator';
import xss from 'xss';

export const sanitizeUserInput = {
  email: (email: string): string => {
    return validator.normalizeEmail(email) || '';
  },

  name: (name: string): string => {
    // First remove script tags and their content
    let sanitized = name.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Then remove all HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    // Apply XSS sanitization
    sanitized = xss(sanitized);
    // Decode HTML entities
    sanitized = sanitized.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
    // Finally trim
    return validator.trim(sanitized);
  },

  password: (password: string): string => {
    return validator.trim(password);
  },

  text: (text: string): string => {
    return xss(validator.trim(text));
  },

  // Per sanitizzare oggetti interi
  sanitizeObject: <T extends object>(obj: T): T => {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = xss(validator.trim(value));
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeUserInput.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized as T;
  }
};
