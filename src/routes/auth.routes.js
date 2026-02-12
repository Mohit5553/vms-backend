const r = require("express").Router();
r.post("/login", (req, res) => res.json({ token: "demo" }));
module.exports = r;
const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

module.exports = router;
