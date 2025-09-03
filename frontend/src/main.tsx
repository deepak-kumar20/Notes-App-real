import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Suppress specific console warnings and errors for cleaner development experience
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  const message = args[0]?.toString() || '';
  // Suppress React Router deprecation warnings
  if (message.includes('React Router Future Flag Warning') ||
      message.includes('v7_startTransition') ||
      message.includes('v7_relativeSplatPath') ||
      message.includes('deprecat')) {
    return;
  }
  originalWarn.apply(console, args);
};

console.error = (...args) => {
  const message = args[0]?.toString() || '';
  // Suppress Google OAuth related errors (they don't affect functionality)
  if (message.includes('GSI_LOGGER') || 
      message.includes('origin is not allowed') ||
      message.includes('Failed to load resource') ||
      message.includes('accounts.google.com') ||
      message.includes('credential_button_library')) {
    return;
  }
  originalError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
