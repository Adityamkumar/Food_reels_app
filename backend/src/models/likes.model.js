import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
    likeCount:{
       type: Number,
       default: 0
    }
  },
  {
    timestamps: true,
  }
);

const likeModel = mongoose.model('like', likeSchema)

export default likeModel