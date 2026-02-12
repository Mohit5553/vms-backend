const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const ctrl = require("../controllers/admin.controller");

router.get("/users", auth, role("admin"), ctrl.getUsers);
router.put("/users/:id", auth, role("admin"), ctrl.updateUserRole);
router.get("/dashboard", ctrl.getDashboardStats); // use controller directly
router.get("/live-screens", ctrl.getLiveScreens);

module.exports = router;
