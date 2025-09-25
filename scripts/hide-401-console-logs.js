/**
 * Console Filter Script
 * Hides expected 401 errors from console to reduce noise
 * 
 * This script filters console error messages for expected 401 unauthorized errors
 * on /api/auth/me and /api/settings endpoints when users are not authenticated.
 * 
 * These errors are expected behavior but create console noise, so we filter them
 * while preserving all other error logging.
 */

(function() {
  'use strict';
  
  // Store original console methods
  const originalError = console.error;
  const originalLog = console.log;
  const originalWarn = console.warn;
  
  // List of 401 error patterns to hide
  const hide401Patterns = [
    /GET.*\/api\/auth\/me.*401.*Unauthorized/,
    /GET.*\/api\/settings.*401.*Unauthorized/,
    /Failed to load resource.*\/api\/auth\/me.*401/,
    /Failed to load resource.*\/api\/settings.*401/
  ];
  
  // Function to check if message should be hidden
  function shouldHideMessage(message) {
    const messageStr = String(message);
    return hide401Patterns.some(pattern => pattern.test(messageStr));
  }
  
  // Override console.error
  console.error = function(...args) {
    const firstArg = args[0];
    if (shouldHideMessage(firstArg)) {
      return; // Hide the message
    }
    originalError.apply(console, args);
  };
  
  // Override console.log (some fetch errors appear as logs)
  console.log = function(...args) {
    const firstArg = args[0];
    if (shouldHideMessage(firstArg)) {
      return; // Hide the message
    }
    originalLog.apply(console, args);
  };
  
  // Override console.warn
  console.warn = function(...args) {
    const firstArg = args[0];
    if (shouldHideMessage(firstArg)) {
      return; // Hide the message
    }
    originalWarn.apply(console, args);
  };
  
  console.info('🔧 PIVABalance: 401 console filters initialized');
})();
