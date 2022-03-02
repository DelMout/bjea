// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const helmet = require("helmet"); // Protect HTTP headers
// const fileupload = require("express-fileupload");

// const subscriberRoutes = require("./routes/subscriber");
// const volunteerRoutes = require("./routes/volunteer");
// const sessionRoutes = require("./routes/session");
// const availabilityRoutes = require("./routes/availability");

// Models
// const { volunteer } = require("./models");
// const { session } = require("./models");
// const { availability } = require("./models");

//association tables volunteer/availability et session/availability
// availability.belongsTo(volunteer);
// module.exports = { volunteer, availability };
// availability.belongsTo(session);
// module.exports = { session, availability };

app.use(cors()); // Security CORS

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
// app.use(fileupload());

// **** ROUTES ****

// * Subscriber
// app.use("/api/subscriber", subscriberRoutes);

// // * Volunteer
// app.use("/api/volunteer", volunteerRoutes);

// // * Session
// app.use("/api/session", sessionRoutes);

// // * availability
// app.use("/api/availability", availabilityRoutes);

// * Access images
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;
