import { Application } from './application.model.js';

class ApplicationController {
  // @desc    Get all applications for current user
  // @route   GET /api/applications
  // @access  Private
  async getAll(req, res, next) {
    try {
      const applications = await Application.find({ user: req.user._id })
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create a new application
  // @route   POST /api/applications
  // @access  Private
  async create(req, res, next) {
    try {
      const { company, role, status, appliedDate, nextRoundDate, notes, ctc, link, priority } = req.body;

      if (!company || !role) {
        res.status(400);
        throw new Error('Company and role are required');
      }

      const application = await Application.create({
        user: req.user._id,
        company,
        role,
        status: status || 'applied',
        appliedDate: appliedDate || Date.now(),
        nextRoundDate,
        notes: notes || '',
        ctc: ctc || '',
        link: link || '',
        priority: priority || 'medium',
      });

      res.status(201).json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Update an application
  // @route   PUT /api/applications/:id
  // @access  Private
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const application = await Application.findById(id);

      if (!application) {
        res.status(404);
        throw new Error('Application not found');
      }

      if (application.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this application');
      }

      const updated = await Application.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete an application
  // @route   DELETE /api/applications/:id
  // @access  Private
  async remove(req, res, next) {
    try {
      const { id } = req.params;
      const application = await Application.findById(id);

      if (!application) {
        res.status(404);
        throw new Error('Application not found');
      }

      if (application.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this application');
      }

      await Application.findByIdAndDelete(id);

      res.status(200).json({ success: true, message: 'Application deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export default new ApplicationController();
