import express from "express";
import { authUserMiddleware } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  getCurrentUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

//User auth APIs
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);
router.get("/user/me", authUserMiddleware, getCurrentUser);


//Food-Partner auth APIs
router.post("/food-partner/register", registerFoodPartner);
router.post("/food-partner/login", loginFoodPartner);
router.get("/food-partner/logout", logoutFoodPartner);

export default router;
