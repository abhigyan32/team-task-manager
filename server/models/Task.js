const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
      ],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);