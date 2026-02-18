const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth/middleware");

router.use(auth);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/upcoming", controller.getUpcoming);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
