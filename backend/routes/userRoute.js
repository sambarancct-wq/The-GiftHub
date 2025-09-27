import { checkHealth, createUser, getUser } from "../controller/userController.js";
import express from 'express';
const router = express.Router();

router.post('/users', createUser);

router.get('/health', checkHealth);

router.get('/users', getUser);

export default router;