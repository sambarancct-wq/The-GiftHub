import express from "express";
import { addGift } from "../controller/giftAddingController.js";

const router = express.Router()

router.post('/gifts',addGift);

export default router;