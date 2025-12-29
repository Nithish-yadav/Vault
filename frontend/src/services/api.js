const API_URL = import.meta.env.VITE_API_URL || 'https://vault-backend-4v35.onrender.com';
export const sessionAPI = {
  // Get or create session
  async getSession(code) {
    const response = await fetch(`${API_URL}/api/sessions/${code}`);
    return response.json();
  },
  // Save text
  saveText: async (code, text, password = null) => {
    const response = await fetch(`${API_URL}/api/sessions/${code}/text`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, password }),
    });
    if (!response.ok) throw new Error("Failed to save text");
    return response.json();
  },
  // Lock session
  async lockSession(code, password) {
    const response = await fetch(`${API_URL}/api/sessions/${code}/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return response.json();
  },
  // Unlock session
  async unlockSession(code, password) {
    const response = await fetch(`${API_URL}/api/sessions/${code}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return response.json();
  },
  // Delete session
  async deleteSession(code) {
    const response = await fetch(`${API_URL}/api/sessions/${code}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
};