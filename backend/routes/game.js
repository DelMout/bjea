const express = require("express");
const router = express.Router();

const gameCtrl = require("../controllers/game");

const multer = require("../middleware/multer-config.js"); //Upload files
const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a game
router.post("/create", admin, multer, gameCtrl.createGame); // admin

//* Modify a game
router.put("/modifygame/:gameid", admin, multer, gameCtrl.modifyGame); // admin

//* Out of stock of a game
router.put("/outofstock/:gameid/:memberid", admin, gameCtrl.outOfStock); //  admin

//* Go into stock
router.put("/intostock/:gameid", admin, gameCtrl.intoStock); //  admin

//* Get all games
router.get("/getallgames", gameCtrl.getAllGames);

module.exports = router;
