import express from 'express';
import { sendContact } from '../controllers/contact.controller.js';
// import { ipLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// POST /api/v1/contact  -> handled here as POST /
router.post('/', sendContact);

export default router;
