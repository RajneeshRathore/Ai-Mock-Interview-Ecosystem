import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authRepository from './auth.repository.js';
import { sendEmail } from '../../utils/email.js';

class AuthService {
  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(userData) {
    const existingUser = await authRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    await this.sendVerificationOtp(user.email);
    return user;
  }

  async sendVerificationOtp(email) {
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    await authRepository.saveOtp(email, hashedOtp, 'verification', expiresAt);

    await sendEmail({
      to: email,
      subject: 'Verify your AI Interview Account',
      html: `<h2>Your OTP is: ${otp}</h2><p>This code expires in 5 minutes.</p>`,
    });
  }

  async verifyOtp(email, otp, type = 'verification') {
    const otpRecord = await authRepository.findOtpByEmailAndType(email, type);
    
    if (!otpRecord) {
      throw new Error('OTP expired or not found');
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      throw new Error('Invalid OTP');
    }

    // OTP matched, mark user as verified if it's a verification OTP
    if (type === 'verification') {
      await authRepository.updateUserById(
        (await authRepository.findUserByEmail(email))._id,
        { isEmailVerified: true }
      );
    }

    // Cleanup OTP
    await authRepository.deleteOtp(email, type);
    return true;
  }

  async forgotPassword(email) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('No account found with that email');
    }

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    await authRepository.saveOtp(email, hashedOtp, 'password-reset', expiresAt);

    await sendEmail({
      to: email,
      subject: 'Reset Your AI Interview Password',
      html: `<h2>Your password reset OTP is: ${otp}</h2><p>This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>`,
    });
  }

  async resetPassword(email, otp, newPassword) {
    // Verify OTP of type 'password-reset'
    await this.verifyOtp(email, otp, 'password-reset');

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    const user = await authRepository.findUserByEmail(email);
    await authRepository.updateUserById(user._id, { password: hashedPassword });

    return true;
  }
}

export default new AuthService();
