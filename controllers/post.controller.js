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
        return res.status(200).json({
          message: "Post created successfully",
          data: {
            postId: newPost.postId,
            description: newPost.description,
            content: newPost.content,
            type: newPost.type,
            likes: newPost.likes.length,
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
          //Success response
          return res.status(200).json({
            message: "Post updation successful",
            data: {
              postId: post.postId,
              description: post.description,
              content: post.content,
              type: post.type,
              likes: post.likes.length,
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

module.exports.userPosts = async (req, res) => {
  if(!req.params.pageNo) {
    return res.status(404).json({
      message: "Pageno is required"
    });
  }
  try {
    //Finding user
    const user = await User.findOne({ _id: req.user });
    if(user) {
      //retrieving data according to pageno
      let items = await Post.find({ user: user }).skip((req.params.pageNo * 10) - 10).limit(10);
      let firstLike = '';
      let restructuredItems = [];
      items.forEach(item => {
        restructuredItems.push({
          postId: item.postId,
          description: item.description,
          content: item.content,
          type: item.type,
          likes: item.likes.length,
          comments: item.comments.length,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        });
      });
      return res.status(200).json({
        message: "Data retrieved",
        data: {
          currentPage: req.params.pageNo,
          totalPages: parseInt((user.posts.length + 9) / 10),
          totalItems: user.posts.length,
          totalItemsInCurrentPage: restructuredItems.length,
          results: restructuredItems
        }
      });
    } else {
      return res.status(404).json({
        message: "User not found"
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Posts retrieving failed"
    });
  }
}