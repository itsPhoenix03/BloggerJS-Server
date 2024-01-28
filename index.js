const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const https = require("https");

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

//Setting up CORS
app.use(
  cors({ origin: [`https://bloggerjs.netlify.app`, `http://localhost:3000`] })
);

//Auth Route
app.use("/api/auth", authRoute);

//Users Route
app.use("/api/user", userRoute);

//Posts Route
app.use("/api/posts", postsRoute);

//Categories Route
app.use("/api/categories", categoryRoute);

//Self Ping System
setInterval(() => {
  https.get("https://bloggerjsserver.onrender.com/api/");
  console.log("pinged");
}, 840000); // every 14 minutes (840000)

//PORT
const PORT = process.env.PORT || 5000;

//Listen on PORT
app.listen(PORT, () => console.log(`Server Running on Port:${PORT}`));
