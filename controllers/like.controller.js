const Post = require('../models/post.model');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const Replies = require('../models/replies.model');

//Like / Unlike a post, comments, replies ...
module.exports.toggleLike = async (req, res) => {
  if(!req.params.id || !req.params.type) {
    return res.status(200).json({
      message: "Id / type is required"
    });
  }
  try {
    let item;
    if(req.params.type === "post") {
      item = await Post.findOne({ postId: req.params.id });
    } else if(req.params.type === "comment") {
      item = await Comment.findOne({ commentId: req.params.id });
    } else if(req.params.type === "reply") {
      item = await Replies.findOne({ replyId: req.params.id });
    }
    if(item) {
      let likeable = await item.populate('likes');;
      let liked = true;

      //Check if a like already exists
      let existingLike = await Like.findOne({
        likeable: item._id,
        onModel: req.params.type === "post" ? "Post" : req.params.type === "comment" ? "Comment" : "Replies",
        user: req.user._id
      });
      //If like already exists then remove it
      if(existingLike) {
        likeable.likes.pull(existingLike);
        likeable.save();
        existingLike.remove();
        liked = false;
      } else{
        //Else make a new like
        let newLike = await Like.create({
          user: req.user._id,
          likeable: item._id,
          onModel: req.params.type === "post" ? "Post" : req.params.type === "comment" ? "Comment" : "Replies",
        });
        likeable.likes.push(newLike);
        likeable.save();
      }
      return res.status(200).json({
        message: `${liked ? 'Liked' : 'Unliked'} ${req.params.type}`,
        data: {
          liked: liked,
          type: req.params.type,
          id: req.params.id
        }
      });
    } else {
      return res.status(404).json({
        message: `${req.params.type} not found`
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Like failed"
    });
  }
}