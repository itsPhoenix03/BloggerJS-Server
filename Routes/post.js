const router = require("express").Router();

//Schema's
const User = require("../Models/User");
const Post = require("../Models/Post");

//CREATE POST
router.post("/", async (req, res) => {
  //Creating the new post
  const newPost = new Post(req.body);

  try {
    //Saving the post to database
    const savedPost = await newPost.save();

    //Sending the response
    res.status(200).json(savedPost);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    //Finding the post with the given id in database
    const post = await Post.findById(req.params.id);

    //Checking that the post author are same
    if (post.author === req.body.author) {
      //Updating the post
      try {
        //Finding the post to be updated in the database
        const updatePost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );

        res.status(200).json(updatePost);
      } catch (error) {
        //Error Handling
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can only Update your Post!");
    }
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    //Finding the post with the given id in database
    const post = await Post.findById(req.params.id);

    //Checking that the post author are same
    if (post.author === req.body.author) {
      //Deleting the post
      try {
        await post.delete();

        res.status(200).json("Post Deleted");
      } catch (error) {
        //Error Handling
        res.status(500).json(error);
      }
    } else {
      res.status(401).json("You can only Delete your Post!");
    }
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//GET SINGLE POST
router.get("/:id", async (req, res) => {
  //Finding the required post by provided id
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//GET ALL THE POST AND ALL POST WHICH MATCH WITH THE QUERY SELECTOR
router.get("/", async (req, res) => {
  //Query Selector's
  const author = req.query.author;
  const categories = req.query.categories;

  //Finding all the post based on the different conditions
  try {
    //Posts Array
    let posts;

    //Posts according to the queries
    if (author && categories) {
      posts = await Post.find({
        author,
        categories: {
          $in: [categories],
        },
      });
    } else if (author) posts = await Post.find({ author });
    else if (categories) {
      posts = await Post.find({
        categories: {
          $in: [categories],
        },
      });
    } else posts = await Post.find();

    //Response
    res.status(200).json(posts);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//Exporting the router
module.exports = router;
