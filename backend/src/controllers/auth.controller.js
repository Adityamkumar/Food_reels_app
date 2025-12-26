import userModel from "../models/user.model.js";
import foodPartnerModel from "../models/foodpartner.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User register successfully",
      user: {
        _id: (await user)._id,
        fullName: (await user).fullName,
        email: (await user).email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }

    const token = await jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    messsage: "User logged out successfully",
  });
};

export const registerFoodPartner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
      email,
    });

    if (isAccountAlreadyExists) {
      return res.status(400).json({
        message: "Food Partner cccount already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const foodPartner = foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        _id: (await foodPartner)._id,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "Food Partner register successfully",
      foodPartner: {
        _id: (await foodPartner)._id,
        name: (await foodPartner).name,
        email: (await foodPartner).email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginFoodPartner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password!",
      });
    }

    res.status(200).json({
        message: 'Food Partner logged in successfully',
        foodPartner:{
           _id: foodPartner._id,
           name: foodPartner.name,
           email: foodPartner.email
        }
    })

  } catch (error) {
      return res.status(500).json({
         message:'Internal server error'
      })
  }
};

export const logoutFoodPartner = async (req, res) => {
   res.clearCookie('token');
   res.status(200).json({
      message:'Food Partner logged out successfully'
   })
}