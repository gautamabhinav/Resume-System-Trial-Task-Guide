import { Router } from "express";
import { getsummary, getsummaryText } from "../controllers/summary,controller.js";
const router = Router();

router
    .route('/')
    .post( getsummary);    

router
    .route('/text')
    .post( getsummaryText);

export default router;