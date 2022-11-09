const router = require("express").Router();
const bcrypt = require("bcrypt");

//Schema's
const User = require("../Models/User");
const Post = require("../Models/Post");

//UPDATE
router.put("/:id", async (req, res) => {
  //If user Id matched from database then update the account
  if (req.body.userId === req.params.id) {
    //Password has been sent in the body
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      //Updating user
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updateUser);
    } catch (error) {
      //Error handling
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("You can only Update your Account!");
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  //If the user Id matched from the database then delete the user account

  try {
    //Find the user in database
    const user = await User.findById(req.params.id);

    //Find the post and user in database to delete the all post and user
    try {
      //Finding all the  post and deleting them
      await Post.deleteMany({ author: user.username });

      //Finding the user and deleting
      await User.findByIdAndDelete(req.params.id);

      //Sending the response
      res.status(200).json("User has been Deleted");
    } catch (error) {
      //Error Handling
      res.status(500).json(error);
    }
  } catch (error) {
    //Error handling
    res.status(500).json(error);
  }
});

//GET SINGLE USER
router.get("/:id", async (req, res) => {
  //Finding the user
  try {
    const user = await User.findById(req.params.id);

    //Removing the password from the data
    const { password, ...props } = user._doc;

    //Sending back the response
    res.status(200).json(props);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//GET AUTHOR IMAGE
router.get("/:username", async (res, req) => {
  //Finding the author
  try {
    const user = await User.findOne(req.params.username.replace("%20", " "));

    //Fetching the profile picture of author
    const { profilePicture, ...props } = user._doc;
    //Sending back the response
    res.status(500).json(authorProfilePicture);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

module.exports = router;
