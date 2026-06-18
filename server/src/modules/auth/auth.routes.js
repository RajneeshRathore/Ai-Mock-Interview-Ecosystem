import express from 'express';
import rateLimit from 'express-rate-limit';
import authController from './auth.controller.js';
import { 
  registerSchema, 
  loginSchema, 
  verifyOtpSchema, 
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from './auth.validation.js';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { success: false, message: 'Too many attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to validate Zod schemas
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    res.status(400);
    next(new Error(err.errors.map(e => e.message).join(', ')));
  }
};

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/resend-otp', authLimiter, validate(resendOtpSchema), authController.resendOtp);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);

export default router;
