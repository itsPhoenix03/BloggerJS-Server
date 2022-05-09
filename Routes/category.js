const router = require("express").Router();

//Schema's
const Category = require("../Models/Category");

//POST
router.post("/", async (req, res) => {
  //Creating the category
  const newCategory = new Category(req.body);

  //Saving the new Category in the database
  try {
    const saveCategory = await newCategory.save();

    //Response
    res.status(200).json(saveCategory);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//GET
router.get("/", async (req, res) => {
  //Fetching all the categories from the database
  try {
    const categories = await Category.find();

    //Response
    res.status(200).json(categories);
  } catch (error) {
    //Error Handling
    res.status(500).json(error);
  }
});

//Export
module.exports = router;
