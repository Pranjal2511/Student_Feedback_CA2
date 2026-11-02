const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

router.post("/", async (req, res) => {
    try {
        const { studentName, courseName, message, rating } = req.body;

        if (!studentName || !courseName || !message || rating === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const feedback = new Feedback({
            studentName,
            courseName,
            message,
            rating
        });

        await feedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully",
            data: feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
            return res.status(400).json({ message: "Invalid page " });
        }

        const skip = (page - 1) * limit;

        const feedback = await Feedback.find()
            .skip(skip)
            .limit(limit);

        const total = await Feedback.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalRecords: total,
            totalPages: Math.ceil(total / limit),
            data: feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Reviewed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({
            message: "Status updated successfully",
            data: feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;