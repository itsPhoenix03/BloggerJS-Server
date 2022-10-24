const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

//Routes
const authRoute = require("./Routes/auth");
const userRoute = require("./Routes/users");
const postsRoute = require("./Routes/post");
const categoryRoute = require("./Routes/category");

//Initialising the application
const app = express();

//config .env file
dotenv.config();

//Configuring for accepting the JSON data
app.use(express.json());

//Use Images folder as static
app.use("/Images", express.static(path.join(__dirname, "/Images")));

//Connecting to the Database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(console.log("Connected to the sever"))
  .catch((err) => console.log(err));

//Setting up CORS for sending request from a url to another url
//Read more https://enable-cors.org/
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS"); //Allowing all the method's to be performed
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

//Setting up CORS
app.use(
  cors({ origin: [`https://bloggerjs.netlify.app`, `http://localhost:3000`] })
);

//Creating the Images folder
function ensureExists(path, cb) {
  fs.mkdir(path, (err) => {
    if (err) {
      if (err.code == "EEXIST")
        cb(null); // Ignore the error if the folder already exists
      else cb(err); // Something else went wrong
    } else cb(null); // Successfully created folder
  });
}

ensureExists(__dirname + "/Images", (err) => {
  // Handle folder creation error
  if (err) console.log(err);
  // We're all good
  else {
    //Uploading the images using multer
    const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, "Images"),
      filename: (req, file, cb) => cb(null, req.body.name),
    });

    const upload = multer({ storage });
    app.post("/api/upload", upload.single("file"), (req, res) =>
      res.status(200).json("Image has been Uploaded!")
    );
  }
});

//Auth Route
app.use("/api/auth", authRoute);

//Users Route
app.use("/api/user", userRoute);

//Posts Route
app.use("/api/posts", postsRoute);

//Categories Route
app.use("/api/categories", categoryRoute);

//PORT
const PORT = process.env.PORT || 5000;

//Listen on PORT
app.listen(PORT, () => console.log(`Server Running on Port:${PORT}`));
