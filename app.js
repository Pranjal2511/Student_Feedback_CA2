const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/feedback", require("./route/feedbackRoute"));

app.get("/", (req, res) => {
    res.send("Student Feedback API Running");
});

module.exports = app;