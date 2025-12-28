const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
export const sessionAPI = {
  // Get or create session
  async getSession(code) {
    const response = await fetch(`${API_URL}/sessions/${code}`);
    return response.json();
  },
  // Save text
  saveText: async (code, text, password = null) => {
    const response = await fetch(`${API_URL}/sessions/${code}/text`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, password }),
    });
    if (!response.ok) throw new Error("Failed to save text");
    return response.json();
  },
  // Lock session
  async lockSession(code, password) {
    const response = await fetch(`${API_URL}/sessions/${code}/lock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return response.json();
  },
  // Unlock session
  async unlockSession(code, password) {
    const response = await fetch(`${API_URL}/sessions/${code}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return response.json();
  },
  // Delete session
  async deleteSession(code) {
    const response = await fetch(`${API_URL}/sessions/${code}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
};