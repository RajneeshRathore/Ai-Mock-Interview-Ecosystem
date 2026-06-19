import authService from './auth.service.js';
import bcrypt from 'bcrypt';
import authRepository from './auth.repository.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
  // @desc    Register user
  // @route   POST /api/auth/register
  // @access  Public
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for OTP.',
        data: { id: user._id, email: user.email }
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        res.status(400);
      }
      next(error);
    }
  }

  // @desc    Login user
  // @route   POST /api/auth/login
  // @access  Public
  async login(req, res, next) {
  try {
    const { email, password } = req.body;

    console.log("Email:", email);

    const user = await authRepository.findUserByEmail(email, true);
    console.log("User:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Stored password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = authService.generateToken(user._id);

    return res.json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

  // @desc    Verify OTP
  // @route   POST /api/auth/verify-otp
  // @access  Public
  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      await authService.verifyOtp(email, otp);

      // Optionally auto-login after verification by generating token here
      const user = await authRepository.findUserByEmail(email);
      const token = authService.generateToken(user._id);

      res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        token,
        data: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  }

  // @desc    Resend OTP
  // @route   POST /api/auth/resend-otp
  // @access  Public
  async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const user = await authRepository.findUserByEmail(email);
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }
      if (user.isEmailVerified) {
        res.status(400);
        throw new Error('Email already verified');
      }

      await authService.sendVerificationOtp(email);
      res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Google OAuth
  // @route   POST /api/auth/google
  // @access  Public
  async googleAuth(req, res, next) {
    try {
      const { credential } = req.body;
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      const { email, name, sub: googleId, picture } = payload;

      let user = await authRepository.findUserByEmail(email);
      
      if (!user) {
        // Create new Google user
        user = await authRepository.createUser({
          name,
          email,
          authProvider: 'google',
          googleId,
          isEmailVerified: true,
          profile: {
            avatarUrl: picture
          }
        });
      }

      const token = authService.generateToken(user._id);
      res.status(200).json({
        success: true,
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(401);
      next(new Error('Invalid Google credential'));
    }
  }

  // @desc    Forgot password — send OTP
  // @route   POST /api/auth/forgot-password
  // @access  Public
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'Password reset OTP sent to your email'
      });
    } catch (error) {
      if (error.message === 'No account found with that email') {
        res.status(404);
      }
      next(error);
    }
  }

  // @desc    Reset password with OTP
  // @route   POST /api/auth/reset-password
  // @access  Public
  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      await authService.resetPassword(email, otp, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully. Please login with your new password.'
      });
    } catch (error) {
      res.status(400);
      next(error);
    }
  }
}

export default new AuthController();
