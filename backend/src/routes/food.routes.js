import express from "express";
import {createFood, getFoodItems, likeFood, saveFood, getSavedFoods, deleteFood, getMyFoodItems} from '../controllers/food.controller.js'
import { authFoodPartnerMiddleware, authUserMiddleware, authCommonMiddleware } from '../middlewares/auth.middleware.js'
import multer from  'multer'

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
})

//POST /api/food/ [/protected/]
router.post('/', authFoodPartnerMiddleware, upload.single('video') ,createFood)

//GET /api/food/ [/protected/]
router.get('/', authCommonMiddleware, getFoodItems)

// Partner routes
router.get('/my-foods', authFoodPartnerMiddleware, getMyFoodItems)
router.delete('/:id', authFoodPartnerMiddleware, deleteFood)


router.post('/like', authUserMiddleware, likeFood)
router.post('/save', authUserMiddleware, saveFood)
router.get('/saved', authUserMiddleware, getSavedFoods)

export default router