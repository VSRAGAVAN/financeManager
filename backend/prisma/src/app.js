const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", require("./modules/auth/routes"));
app.use("/income", require("./modules/income/routes"));
app.use("/expense", require("./modules/expense/routes"));
app.get("/", (req, res) => {
    res.send("API running");
});
app.use("/users", require("./modules/users/routes"));
app.use("/recurring", require("./modules/recurring/routes"));
app.use("/bills", require("./modules/bills/routes"));
app.use("/analytics", require("./modules/analytics/routes"));
app.use("/savings", require("./modules/savings/routes"));

module.exports = app;
