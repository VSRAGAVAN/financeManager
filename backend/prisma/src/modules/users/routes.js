const router = require("express").Router();
const auth = require("../../middlewares/auth/middleware");
const checkRole = require("../../middlewares/auth/rbac");
const controller = require("./controller");

router.use(auth);

// Only Owner can view all users and delete users
router.get("/", checkRole(["OWNER"]), controller.list);
router.delete("/:id", checkRole(["OWNER"]), controller.delete);

module.exports = router;
