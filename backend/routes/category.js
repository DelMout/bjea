const express = require("express");
const router = express.Router();

const categoryCtrl = require("../controllers/category");

// const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * get all categories
router.get("/getallcategories", categoryCtrl.getAllCategories); //!  admin

module.exports = router;
