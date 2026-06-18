import User from './user.model.js';
import bcrypt from 'bcrypt';

class UserController {
  // @desc    Get current user profile
  // @route   GET /api/users/me
  // @access  Private
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          authProvider: user.authProvider,
          isEmailVerified: user.isEmailVerified,
          profile: user.profile || {},
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update current user profile
  // @route   PUT /api/users/me
  // @access  Private
  async updateProfile(req, res, next) {
    try {
      const { name, college, branch, graduationYear, skills } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (college !== undefined) updateData['profile.college'] = college;
      if (branch !== undefined) updateData['profile.branch'] = branch;
      if (graduationYear !== undefined) updateData['profile.graduationYear'] = graduationYear;
      if (skills !== undefined) updateData['profile.skills'] = skills;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { returnDocument: 'after' }
      );

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile || {}
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Change password
  // @route   PUT /api/users/me/password
  // @access  Private
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
      }

      const user = await User.findById(req.user._id).select('+password');

      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }

      // Google auth users don't have a password
      if (user.authProvider === 'google' && !user.password) {
        res.status(400);
        throw new Error('Cannot change password for Google-authenticated accounts');
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(401);
        throw new Error('Current password is incorrect');
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
