const mongoose = require("mongoose");

const repliesSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    photo: {
      type: String
    },
    video: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Replies = mongoose.model("Replies", repliesSchema);
module.exports = Replies;
