import express from 'express'
import { getFoodPartnerById } from '../controllers/food-partner.controller.js';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router()

//GET /api/food/food-partner/:id
router.get('/:id', authUserMiddleware, getFoodPartnerById)

export default router;