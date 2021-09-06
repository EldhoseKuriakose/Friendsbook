const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId
    },
    //Defines the objectid of the liked objects
    likeable: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel"
    },
    //Defining the type of liked object since this is a dynamic reference
    onModel: {
      type: String,
      required: true,
      enum: ["Post", "Comment", "Replies"]
    }
  },
  {
    timestamps: true
  }
);

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
