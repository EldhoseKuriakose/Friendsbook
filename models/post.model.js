const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postId: {
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
      type: String,
      enum: ['photo', 'video', 'text']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    //include the array of id's of all comments in this postSchema itself
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
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

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
