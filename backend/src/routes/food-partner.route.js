import express from 'express'
import { getFoodPartnerById, getCurrentPartner } from '../controllers/food-partner.controller.js';
import { authUserMiddleware, authFoodPartnerMiddleware, authCommonMiddleware } from '../middlewares/auth.middleware.js';
const router = express.Router()

//GET /api/food-partner/profile/me
router.get('/profile/me', authFoodPartnerMiddleware, getCurrentPartner)

//GET /api/food-partner/:id
router.get('/:id', authCommonMiddleware, getFoodPartnerById)

export default router;