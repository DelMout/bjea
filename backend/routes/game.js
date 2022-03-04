const express = require("express");
const router = express.Router();

const gameCtrl = require("../controllers/game");

// const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a game
router.post("/create", gameCtrl.createGame); //!  admin

module.exports = router;
