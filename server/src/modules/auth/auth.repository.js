import User from '../users/user.model.js';
import Otp from '../users/otp.model.js';

class AuthRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async findUserByEmail(email, selectPassword = false) {
    let query = User.findOne({ email });
    if (selectPassword) {
      query = query.select('+password');
    }
    return await query;
  }

  async updateUserById(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after' });
  }

  async saveOtp(email, otp, type, expiresAt) {
    // Delete any existing OTP of same type for this email
    await Otp.deleteMany({ email, type });
    return await Otp.create({ email, otp, type, expiresAt });
  }

  async findOtpByEmailAndType(email, type) {
    // Returns the most recently created OTP
    return await Otp.findOne({ email, type }).sort({ createdAt: -1 });
  }

  async deleteOtp(email, type) {
    return await Otp.deleteMany({ email, type });
  }
}

export default new AuthRepository();
