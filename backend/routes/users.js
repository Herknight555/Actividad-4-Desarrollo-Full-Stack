const express = require("express");
const {
  getMyProfile,
  upgradeToPremium,
  listUsersForAdmin
} = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

router.get("/me", getMyProfile);
router.post("/upgrade", upgradeToPremium);
router.get("/admin/list", authorizeRoles("admin"), listUsersForAdmin);

module.exports = router;
