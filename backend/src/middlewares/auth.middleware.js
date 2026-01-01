import foodPartnerModel from "../models/foodpartner.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authFoodPartnerMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "unauthorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel.findById(decoded.id);

    if (!foodPartner) {
        return res.status(401).json({ message: "Invalid token!" });
    }

    req.foodPartner = foodPartner;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token!",
    });
  }
};


export const authUserMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "unauthorized access",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export const authCommonMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to find User first
    const user = await userModel.findById(decoded.id);
    if (user) {
        req.user = user;
        return next();
    }

    // Try to find Partner
    const partner = await foodPartnerModel.findById(decoded.id);
    if (partner) {
        req.foodPartner = partner;
        return next();
    }

    // Neither found
    return res.status(401).json({ message: "Invalid token" });

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

