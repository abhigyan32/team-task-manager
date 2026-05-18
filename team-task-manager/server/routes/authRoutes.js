const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
      } = req.body;

      const userExists =
        await User.findOne({
          email,
        });

      if (userExists) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      const user =
        await User.create({
          name,
          email,
          password:
            password,
          role,
        });

      res.status(201).json({
        message:
          "Registration successful",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);

router.post(
  "/login",
  async (req, res) => {
    try {
      const { email, password } =
        req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(400).json({
          message:
            "Invalid credentials",
        });
      }

      if (password !== user.password) {
        return res.status(400).json({
          message:
            "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);

router.get(
  "/users",
  async (req, res) => {
    try {
      const users =
        await User.find().select(
          "name email role"
        );

      res.json(users);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;