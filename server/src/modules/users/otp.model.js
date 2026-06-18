import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['verification', 'password_reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0 // Document will be automatically deleted after expiresAt
  }
}, { timestamps: true });

// Create an index on email and type for faster lookups
otpSchema.index({ email: 1, type: 1 });

export default mongoose.model('Otp', otpSchema);
