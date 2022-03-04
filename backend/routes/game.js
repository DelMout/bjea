const express = require("express");
const router = express.Router();

const gameCtrl = require("../controllers/game");

// const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a game
router.post("/create", gameCtrl.createGame); //!  admin

//* Modify a game
router.put("/modifygame/:gameid", gameCtrl.modifyGame); //!  admin

//* Out of stock of a game
router.put("/outofstock/:gameid/:memberid", gameCtrl.outOfStock); //!  admin

//* Go into stock
router.put("/intostock/:gameid", gameCtrl.intoStock); //!  admin

//* Get all games
router.get("/getallgames", gameCtrl.getAllGames);

module.exports = router;
