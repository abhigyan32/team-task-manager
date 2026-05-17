const express = require("express");

const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("Admin"),
  async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;