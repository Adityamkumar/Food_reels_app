import foodModel from "../models/food.model.js";
import likeModel from "../models/likes.model.js";
import saveModel from "../models/save.model.js";
import { uploadFile } from "../services/storage.service.js";
import { v4 as uuidv4 } from "uuid";

export const createFood = async (req, res) => {
  let videoUrl = req.body.video; // Expecting video URL directly from body (frontend upload)

  // Legacy support for direct file upload (if needed, but frontend will likely use direct upload now)
  if (!videoUrl && req.file) {
      const fileUploadResult = await uploadFile(req.file.buffer, uuidv4());
      videoUrl = fileUploadResult.url;
  }

  if (!videoUrl) {
      return res.status(400).json({ message: "Video is required" });
  }

  const foodItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: videoUrl,
    foodPartner: req.foodPartner._id,
  });

  res.status(201).json({
    message: "food created successfully",
    food: foodItem,
  });
};

export const getImageKitAuth = async (req, res) => {
    try {
        const result = getAuthParams();
        res.status(200).json({
            ...result,
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY
        });
    } catch (error) {
        res.status(500).json({ message: "Error generating auth params" });
    }
}


export const getFoodItems = async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const foodItems = await foodModel.find({}).lean();

  const foodsWithStatus = await Promise.all(foodItems.map(async (food) => {
     let isLiked = false;
     let isSaved = false;

     if (userId) {
         isLiked = await likeModel.exists({ user: userId, food: food._id });
         isSaved = await saveModel.exists({ user: userId, food: food._id });
     }

     const likeCount = await likeModel.countDocuments({ food: food._id });
     return { ...food, isLiked: !!isLiked, isSaved: !!isSaved, likeCount };
  }));

  res.status(200).json({
    message: "Food items fetched successfully!",
    foodItems: foodsWithStatus,
  });
};


export const likeFood = async (req, res) => {
  const { foodId } = req.body;
  const user = req.user;

  const isAlreadyLiked = await likeModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadyLiked) {
    await likeModel.deleteOne({
      user: user._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId,{
           $inc:{likeCount: -1}
    })

    return res.status(200).json({
      message: "Food Unliked successfully",
    });
  }

  const like = await likeModel.create({
    user: user._id,
    food: foodId,
  });

  await foodModel.findByIdAndUpdate(foodId,{
      $inc: {likeCount: 1}
  })

  res.status(200).json({ message: "food liked successfully", like });
};

export const saveFood = async (req, res) => {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if(isAlreadySaved){
       await saveModel.deleteOne({
        user: user._id,
        food: foodId
       })

       return res.status(200).json({
         message: "Food unsaved successfully"
       })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    res.status(200).json({
       message: "Food saved successfully",
       save
    })
}

export const getSavedFoods = async (req, res) => {
    try {
        const userId = req.user._id;
        const savedDocs = await saveModel.find({ user: userId }).populate({
            path: 'food',
            populate: {
                path: 'foodPartner'
            }
        });
        
        // Extract the food items from the saved documents
        const savedFoods = savedDocs.map(doc => doc.food);

        res.status(200).json({
            message: "Saved foods fetched successfully",
            savedFoods
        });
    } catch (error) {
        console.error("Error fetching saved foods:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyFoodItems = async (req, res) => {
    try {
        const partnerId = req.foodPartner._id;
        const foodItems = await foodModel.find({ foodPartner: partnerId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "My food items fetched successfully",
            foodItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        const partnerId = req.foodPartner._id;

        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        if (food.foodPartner.toString() !== partnerId.toString()) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        await likeModel.deleteMany({ food: id });
        await saveModel.deleteMany({ food: id });
        
        await foodModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
