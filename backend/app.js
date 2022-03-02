require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const helmet = require("helmet"); // Protect HTTP headers
// const fileupload = require("express-fileupload");

const memberRoutes = require("./routes/member");

// Models
// const { member } = require("./models");

//association tables volunteer/availability et session/availability
// availability.belongsTo(volunteer);
// module.exports = { volunteer, availability };
// availability.belongsTo(session);
// module.exports = { session, availability };

app.use(cors()); // Security CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
// app.use(fileupload());

// **** ROUTES ****

// * Member
app.use("/api/member", memberRoutes);

// // * Volunteer
// app.use("/api/volunteer", volunteerRoutes);

// // * Session
// app.use("/api/session", sessionRoutes);

// // * availability
// app.use("/api/availability", availabilityRoutes);

// * Access images
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;
