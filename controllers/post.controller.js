const Post = require('../models/post.model');
const User = require('../models/user.model');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');
const Replies = require('../models/replies.model');
const crypto = require("crypto");

//Create Post
module.exports.create = async (req, res) => {
  if(!req.body.description) {
    return res.status(404).json({
      message: "Description is required"
    });
  }
  try {
    //Finding user
    const user = await User.findOne({ _id: req.user });
    if(user) {
      //Checking post type is valid
      const validType = Post.schema.path('type').enumValues.includes(req.body.type);
      if(validType) {
        const newPost = await Post.create({
          postId: crypto.randomBytes(16).toString("hex"),
          description: req.body.description,
          content: req.body.content,
          type: req.body.type,
          user: user
        });
        //Save Post to user model
        user.posts.push(newPost);
        user.save();
        let firstLike = '';
        if(newPost.likes.length > 0) {
          let temp = await Like.findOne({ user: newPost.likes[0] });
          firstLike = await User.findOne({ _id: temp.user });
        }
        return res.status(200).json({
          message: "Post created successfully",
          data: {
            postId: newPost.postId,
            description: newPost.description,
            content: newPost.content,
            type: newPost.type,
            likes: newPost.likes.length,
            firstLike: firstLike,
            comments: newPost.comments.length,
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar
            }
          }
        });
      } else {
        return res.status(406).json({
          message: "Invalid post type"
        });
      }
    } else {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Post creation failed"
    });
  }
}

module.exports.update = async (req, res) => {
  if(!req.body.postId) {
    return res.status(404).json({
      message: "Post id is required"
    });
  }
  try {
    //Finding user
    const user = await User.findOne({ _id: req.user });
    if(user) {
      //Checking post type is valid
      const validType = Post.schema.path('type').enumValues.includes(req.body.type);
      if(validType) {
        const post = await Post.findOne({ postId: req.body.postId });
        if(post) {
          if(req.body.type) {
            post.type = req.body.type;
          }
          if(req.body.description) {
            post.description = req.body.description;
          }
          if(req.body.content) {
            post.content = req.body.content;
          }
          post.save();
          let firstLike = '';
          if(post.likes.length > 0) {
            let temp = await Like.findOne({ user: post.likes[0] });
            firstLike = await User.findOne({ _id: temp.user });
          }
          //Success response
          return res.status(200).json({
            message: "Post updation successful",
            data: {
              postId: post.postId,
              description: post.description,
              content: post.content,
              type: post.type,
              likes: post.likes.length,
              firstLike: firstLike,
              comments: post.comments.length,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
              user: {
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar
              }
            }
          })
        } else {
          return res.status(404).json({
            message: "Post not found"
          });
        }
      } else {
        return res.status(406).json({
          message: "Invalid post type"
        });
      }
    } else {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Post updation failed"
    });
  }
}

//Delete a post
module.exports.remove = async (req, res) => {
  if(!req.body.postId) {
    return res.status(404).json({
      message: "Post id is required"
    });
  }
  try {
    //Finding user
    const user = await User.findOne({ _id: req.user });
    if(user) {
      const post = await Post.findOne({ postId: req.body.postId });
      if(post) {
        await Like.deleteMany({ likeable: post, onModel: "Post" });
        await Like.deleteMany({ _id: { $in: post.comments.replies } });
        await Like.deleteMany({ _id: { $in: post.comments } });
        await Replies.deleteMany({ post: post });
        await Comment.deleteMany({ post: post });
        post.remove();
        //Success response
        return res.status(200).json({
          message: "Post deletion successful",
          data: {
            postId: req.body.postId
          }
        });
      } else {
        return res.status(404).json({
          message: "Post not found"
        });
      }
    } else {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Post deletion failed"
    });
  }
}