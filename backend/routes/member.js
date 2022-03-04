const express = require("express");
const router = express.Router();

const memberCtrl = require("../controllers/member");

// const admin = require("../middleware/isAdmin"); // Request authentification for admin

// * Create a member
router.post("/create", memberCtrl.createMember); //!  admin

// * Login for a member admin
router.post("/login", memberCtrl.login);

// * Get all members
router.get("/getallmembers", memberCtrl.getAllMembers); //!  admin

// * Modify password after lost
router.put("/password/:jeton", memberCtrl.updatePassword);

// * Update jeton (used for forgotten password)
router.put("/newjeton/:email", memberCtrl.newjeton); //! admin

//* Find member from his jeton
router.get("/fromjeton/:jeton", memberCtrl.jeton);

// * send email for updating password
router.post("/emailpassword/:email", memberCtrl.emailPassword);

// * send email to all members
router.post("/emailinfo", memberCtrl.emailInfo); //! Admin

module.exports = router;
