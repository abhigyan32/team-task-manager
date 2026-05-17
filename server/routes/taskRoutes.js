const express = require("express");

const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;