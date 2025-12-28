import express from 'express';
import * as controller from '../controllers/session.controller.js';

const router = express.Router();

// Get or create session by code
router.get('/:code', controller.getOrCreateSession);

// Save text to session
router.put('/:code/text', controller.saveText);

// Lock session with password
router.post('/:code/lock', controller.lockSession);

// Unlock session with password
router.post('/:code/unlock', controller.unlockSession);

// Delete session
router.delete('/:code', controller.deleteSession);

export default router;
