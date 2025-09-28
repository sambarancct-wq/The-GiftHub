import express from 'express';
import { validateUser } from '../controller/loginController.js';
const router = express.Router();

router.post('/login',validateUser);

export default router;