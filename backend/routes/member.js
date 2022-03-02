const express = require("express");
const router = express.Router();

const memberCtrl = require("../controllers/member");

// const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a member
router.post("/create", memberCtrl.createMember); //!  admin

module.exports = router;
