const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth/middleware");

router.use(auth);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/suggestions", controller.getSuggestions);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
