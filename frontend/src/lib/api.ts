// API configuration
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('isAuthenticated', 'true');
  // Trigger storage event for other components
  window.dispatchEvent(new Event('storage'));
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAuthenticated');
  // Trigger storage event for other components
  window.dispatchEvent(new Event('storage'));
};

// API utility functions
export const api = {
  // Send OTP for signup
  sendSignupOTP: async (userData: { name: string; email: string; dob: string }) => {
    const response = await fetch(`${API_BASE_URL}/send-signup-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Send OTP for signin
  sendSigninOTP: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/send-signin-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Verify OTP for signup
  verifySignupOTP: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/verify-signup-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store token if signup is successful
    if (data.success && data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },

  // Verify OTP for signin
  verifySigninOTP: async (email: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/verify-signin-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Return the server error message instead of throwing
      return {
        success: false,
        message: data.message || `HTTP error! status: ${response.status}`
      };
    }
    
    // Store token if signin is successful
    if (data.success && data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },

  // Resend OTP
  resendOTP: async (email: string, type: 'signup' | 'signin') => {
    const response = await fetch(`${API_BASE_URL}/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, type }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get user profile
  getProfile: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/signin';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get all notes
  getNotes: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/signin';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Create a new note
  createNote: async (noteData: { title: string; content: string; tags?: string[]; isImportant?: boolean }) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/signin';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Update a note
  updateNote: async (noteId: string, noteData: { title?: string; content?: string; tags?: string[]; isImportant?: boolean }) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/signin';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Delete a note
  deleteNote: async (noteId: string) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/signin';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Sign out
  signOut: async () => {
    const token = getAuthToken();
    if (!token) {
      removeAuthToken();
      return { success: true, message: 'Already signed out' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      removeAuthToken();
      return data;
    } catch (error) {
      // Even if the API call fails, remove the token locally
      removeAuthToken();
      return { success: true, message: 'Signed out locally' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getAuthToken();
    const isAuth = localStorage.getItem('isAuthenticated');
    return !!(token && isAuth === 'true');
  },

  // Google Authentication
  googleAuth: async (credential: string) => {
    const response = await fetch(`${API_BASE_URL}/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store token if authentication is successful
    if (data.success && data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },

  // Remove auth token (for logout)
  removeAuthToken,
};
