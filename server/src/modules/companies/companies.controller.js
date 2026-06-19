import companies from './companies.data.js';

class CompaniesController {
  // @desc    Get all companies
  // @route   GET /api/companies
  // @access  Public
  async getAll(req, res, next) {
    try {
      // Return a lightweight list (without full sampleQuestions)
      const list = companies.map(({ sampleQuestions, interviewProcess, ...rest }) => ({
        ...rest,
        questionCount: sampleQuestions.length,
        stageCount: interviewProcess.length,
      }));

      res.status(200).json({
        success: true,
        data: list,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get company by ID
  // @route   GET /api/companies/:id
  // @access  Public
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const company = companies.find(c => c.id === id);

      if (!company) {
        res.status(404);
        throw new Error('Company not found');
      }

      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CompaniesController();
