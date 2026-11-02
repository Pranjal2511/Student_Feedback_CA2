
const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.post("/", async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();

        res.status(201).json({
            message: "Feedback added successfully",
            data: feedback
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const feedback = await Feedback.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Feedback.countDocuments();

        res.json({
            currentPage: page,
            totalRecords: total,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.json({
            message: "Status updated successfully",
            data: feedback
        });
    } catch (error) {
        res.status(400).json({ message: "Invalid ID or request" });
    }
});

module.exports = router;

