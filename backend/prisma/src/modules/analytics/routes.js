const express = require("express");
const router = express.Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth/middleware");
const rbac = require("../../middlewares/auth/rbac");

// Premium only insights and exports
router.get("/summary", auth, controller.getSummary);
router.get("/export/pdf", auth, controller.exportPDF);
router.get("/export/excel", auth, controller.exportExcel);
router.get("/export/gst", auth, controller.exportGSTSummary);

module.exports = router;
