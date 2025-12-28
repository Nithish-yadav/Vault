import Session from '../models/Session.js';
import { encrypt, decrypt } from '../utils/crypto.js';
import bcrypt from 'bcryptjs';

// Create or get existing session by code
export async function getOrCreateSession(req, res) {
  try {
    const { code } = req.params;
    
    // Try to find existing session
    let session = await Session.findOne({ code: code.toUpperCase() });
    
    if (session) {
      // Return existing session
      // If locked, DO NOT send text. Frontend must ask for password to unlock.
      return res.json({
        code: session.code,
        text: session.isLocked ? null : decrypt(session.encryptedText),
        isLocked: session.isLocked,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      });
    }
    
    // Create new session
    const expiryHours = parseInt(process.env.SESSION_EXPIRY_HOURS) || 24;
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    
    session = await Session.create({
      code: code.toUpperCase(),
      encryptedText: '',
      expiresAt
    });
    
    res.status(201).json({
      code: session.code,
      text: '',
      isLocked: false,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    console.error('Error in getOrCreateSession:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Save/update text in session
export async function saveText(req, res) {
  try {
    const { code } = req.params;
    const { text, password } = req.body;
    
    const session = await Session.findOne({ code: code.toUpperCase() });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.isLocked) {
       if (!password) {
         return res.status(403).json({ error: 'Session is locked. Authentication required.' });
       }
       const isValid = await bcrypt.compare(password, session.passwordHash);
       if (!isValid) {
         return res.status(401).json({ error: 'Invalid password' });
       }
       // If valid, proceed to save (and session stays locked)
    }
    
    // Encrypt and save text
    session.encryptedText = encrypt(text || '');
    await session.save();
    
    res.json({
      code: session.code,
      text: decrypt(session.encryptedText),
      isLocked: session.isLocked
    });
  } catch (error) {
    console.error('Error in saveText:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Lock session with password
export async function lockSession(req, res) {
  try {
    const { code } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }
    
    const session = await Session.findOne({ code: code.toUpperCase() });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.isLocked) {
      return res.status(400).json({ error: 'Session already locked' });
    }
    
    // Hash password and lock session
    const passwordHash = await bcrypt.hash(password, 10);
    session.isLocked = true;
    session.passwordHash = passwordHash;
    await session.save();
    
    res.json({
      code: session.code,
      isLocked: true,
      message: 'Session locked successfully'
    });
  } catch (error) {
    console.error('Error in lockSession:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Unlock session with password
export async function unlockSession(req, res) {
  try {
    const { code } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }
    
    const session = await Session.findOne({ code: code.toUpperCase() });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (!session.isLocked) {
      return res.status(400).json({ error: 'Session is not locked' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, session.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Return text WITHOUT clearing lock (Persistent Lock)
    // session.isLocked = false; <-- REMOVED
    // session.passwordHash = null; <-- REMOVED
    // await session.save(); <-- REMOVED
    
    res.json({
      code: session.code,
      text: decrypt(session.encryptedText),
      isLocked: true, // Still true
      message: 'Access granted'
    });
  } catch (error) {
    console.error('Error in unlockSession:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

// Delete session
export async function deleteSession(req, res) {
  try {
    const { code } = req.params;
    
    const result = await Session.deleteOne({ code: code.toUpperCase() });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSession:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
