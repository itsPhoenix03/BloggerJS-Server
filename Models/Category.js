const mongoose = require("mongoose");

//Defining the Category Schema
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//Exporting the Category Schema
module.exports = mongoose.model("Category", CategorySchema);
