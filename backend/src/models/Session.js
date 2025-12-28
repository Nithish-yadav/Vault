import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true,
    trim: true
  },
  encryptedText: {
    type: String,
    default: ''
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  passwordHash: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  }
});

// Auto-delete expired sessions using TTL index
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Session', sessionSchema);
