const router = require("express").Router();
const auth = require("../../middlewares/auth/middleware");
const checkRole = require("../../middlewares/auth/rbac");
const controller = require("./controller");

router.use(auth);

// All users can create and view their own? 
// For now, list is for admin to manage all.
router.get("/", checkRole(["OWNER", "ADMIN"]), controller.list);
router.post("/", controller.create);
router.patch("/:id/status", checkRole(["OWNER", "ADMIN"]), controller.updateStatus);

module.exports = router;
