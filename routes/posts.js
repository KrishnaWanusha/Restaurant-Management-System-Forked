const express = require("express");
const Posts = require("../models/posts");

const router = express.Router();

//Save posts
router.post("/save", async (req, res) => {
  try {
    let newPost = new Posts(req.body);
    await newPost.save(); // Save the post without callback
    return res.status(200).json({
      success: "Posts saved successfully",
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
});
//Get posts
router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find(); // Use async/await instead of exec with callback
    return res.status(200).json({
      success: true,
      existingPosts: posts,
    });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
});

//Update posts
router.put("/post/update/:id", (req, res) => {
  Posts.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, post) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      return res.status(200).json({
        success: "Updated Successfully",
      });
    }
  );
});

//Delete posts
router.delete("/post/delete/:id", (req, res) => {
  Posts.findByIdAndRemove(req.params.id).exec((err, deletedPost) => {
    if (err)
      return res.status(400).json({
        message: "Delete Unsuccessful",
        err,
      });
    return res.json({
      message: "Delete successsful",
      deletedPost,
    });
  });
});

//Get a specific post
router.get("/post/:id", (req, res) => {
  let postId = req.params.id;

  Posts.findById(postId, (err, post) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
      post,
    });
  });
});

module.exports = router;
