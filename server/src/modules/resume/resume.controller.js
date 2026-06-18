import resumeService from './resume.service.js';

class ResumeController {
  // @desc    Upload and analyze resume
  // @route   POST /api/resume/upload
  // @access  Private
  async uploadAndAnalyze(req, res, next) {
    try {
      if (!req.file) {
        res.status(400);
        throw new Error('No resume file provided');
      }

      // The file is uploaded to Cloudinary by multer middleware
      const fileUrl = req.file.path; 

      const analysis = await resumeService.processResume(fileUrl);

      res.status(200).json({
        success: true,
        message: 'Resume analyzed successfully',
        data: {
          fileUrl,
          analysis
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ResumeController();
