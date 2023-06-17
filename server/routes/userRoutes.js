const router = require("express").Router();
const { registerUser, loginUser, allUsers, forgotPassword, resetPassword } = require("../controllers/userControllers");
const auth = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(auth, allUsers);
router.route("/forgotPassword").post(forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.route("/login").post(loginUser);
module.exports = router;
