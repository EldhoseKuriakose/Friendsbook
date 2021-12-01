const mongoose = require("mongoose");

const repliesSchema = new mongoose.Schema(
  {
    replyId: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    content: {
      type: String
    },
    type: {
      type: String
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
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
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Replies"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Replies = mongoose.model("Replies", repliesSchema);
module.exports = Replies;
