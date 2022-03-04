require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const helmet = require("helmet"); // Protect HTTP headers
// const fileupload = require("express-fileupload");

const memberRoutes = require("./routes/member");
const gameRoutes = require("./routes/game");
const categoryRoutes = require("./routes/category");

// Models
const { member } = require("./models");
const { game } = require("./models");

//association tables volunteer/availability
game.belongsTo(member);
module.exports = { member, game };

app.use(cors()); // Security CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
// app.use(fileupload());

// **** ROUTES ****

// * Member
app.use("/api/member", memberRoutes);

// * Game
app.use("/api/game", gameRoutes);

// * Category
app.use("/api/category", categoryRoutes);

// * Access images
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;
