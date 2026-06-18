import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');
import aiService from '../ai/ai.service.js';
import axios from 'axios';

class ResumeService {
  async processResume(fileUrl) {
    try {
      // 1. Fetch the file from Cloudinary URL as an arraybuffer
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      // 2. Parse the PDF
      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();
      const resumeText = pdfData.text;
      
      // cleanup the parser
      await parser.destroy();

      // 3. Send text to AI for extraction
      const aiAnalysis = await aiService.extractResumeDetails(resumeText);
      
      return aiAnalysis;
    } catch (error) {
      console.error('Error processing resume:', error);
      throw new Error('Failed to process resume file');
    }
  }
}

export default new ResumeService();
