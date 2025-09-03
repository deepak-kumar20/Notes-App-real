import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface GoogleSignInButtonProps {
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleSignInButton({ 
  className = "" 
}: GoogleSignInButtonProps) {
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = async (response: any) => {
    try {
      if (!response.credential) {
        toast.error('No credential received from Google');
        return;
      }

      const result = await api.googleAuth(response.credential);
      
      if (result.success) {
        toast.success(result.message || 'Signed in successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Failed to sign in with Google');
      }
    } catch (error) {
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  useEffect(() => {
    // Suppress Google OAuth iframe errors in console
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      // Suppress specific Google OAuth errors
      if (message.includes('GSI_LOGGER') || 
          message.includes('origin is not allowed') ||
          message.includes('Failed to load resource') ||
          message.includes('accounts.google.com')) {
        return;
      }
      originalError.apply(console, args);
    };

    // Check if Google Client ID is configured
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript && window.google) {
      // Script already loaded, initialize directly
      if (googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: false
          });

          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'outline',
              size: 'large',
              width: 350,
              text: 'continue_with',
              shape: 'rectangular',
              locale: 'en'
            }
          );
        } catch (error) {
          // Error handling for existing script
        }
      }
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        try {
          // Initialize the Google Sign-In
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: false
          });

          // Render the Google Sign-In button
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              theme: 'outline',
              size: 'large',
              width: 350,
              text: 'continue_with',
              shape: 'rectangular',
              locale: 'en'
            }
          );
          
        } catch (error) {
          toast.error('Failed to initialize Google Sign-In. Please refresh the page.');
        }
      }
    };

    script.onerror = () => {
      toast.error('Failed to load Google Sign-In. Please check your internet connection.');
    };

    return () => {
      // Restore original console.error
      console.error = originalError;
      
      // Cleanup: remove script only if we added it
      if (!existingScript && document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Clear the button reference
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = '';
      }
    };
  }, [navigate]);

  // Don't render if Google OAuth is not configured
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div ref={googleButtonRef} className="google-signin-button"></div>
    </div>
  );
}
