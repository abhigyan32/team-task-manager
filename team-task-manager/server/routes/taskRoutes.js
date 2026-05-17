const express = require("express");

const router = express.Router();

const Task = require("../models/Task");

const protect = require(
  "../middleware/authMiddleware"
);

router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate(
        "assignedTo",
        "name email role"
      );

    res.json(tasks);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo:
        assignedTo || null,
      status: "Pending",
    });

    const populatedTask =
      await Task.findById(task._id)
        .populate(
          "assignedTo",
          "name email role"
        );

    res.status(201).json(
      populatedTask
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      task.status =
        req.body.status ||
        task.status;

      await task.save();

      res.json(task);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      await task.deleteOne();

      res.json({
        message:
          "Task deleted successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;