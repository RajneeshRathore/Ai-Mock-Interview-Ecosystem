import express from 'express';
import companiesController from './companies.controller.js';

const router = express.Router();

router.get('/', companiesController.getAll);
router.get('/:id', companiesController.getById);

export default router;
