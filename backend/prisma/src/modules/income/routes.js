const router = require("express").Router();
const auth = require("../../middlewares/auth/middleware");
const checkRole = require("../../middlewares/auth/rbac");
const controller = require("./controller");

router.use(auth);

// Staff, Admin, Owner can create/update
router.post("/", checkRole(["OWNER", "ADMIN", "STAFF"]), controller.create);
router.put("/:id", checkRole(["OWNER", "ADMIN", "STAFF"]), controller.update);

// Only Owner, Admin can delete
router.delete("/:id", checkRole(["OWNER", "ADMIN"]), controller.delete);

// All roles (including Viewer) can view
router.get("/", checkRole(["OWNER", "ADMIN", "STAFF", "VIEWER"]), controller.list);

module.exports = router;
