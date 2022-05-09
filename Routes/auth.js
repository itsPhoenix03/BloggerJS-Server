const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  //Process involves faliure chances
  try {
    const { username, email, password } = req.body;

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    //Saving the user  in database
    const user = await newUser.save();

    //sending back the response
    res.status(200).json(user);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //Finding that user in database
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong Credentials!");

    //Validating the password
    const validate = await bcrypt.compare(req.body.password, user.password);
    !validate && res.status(400).json("Wrong Credentials!");

    //Both are matched
    const { password, ...props } = user._doc;
    res.status(200).json(props);
  } catch (error) {
    //Error handling
    res.status(500).json(error);
  }
});

//Exporting the route
module.exports = router;
