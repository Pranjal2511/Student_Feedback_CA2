const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/feedback", require("./route/feedbackRoute"));

app.get("/", (req, res) => {
    res.json({
        message: "Student Feedback API Running",
        status: "Success"
    });
});

module.exports = app;