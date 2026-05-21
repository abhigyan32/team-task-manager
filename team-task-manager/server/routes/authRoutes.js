const express = require("express");

const router = express.Router();

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

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      await User.create({
        name,
        email,
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
            "User not found",
        });
      }

      if (
        user.password !==
        password
      ) {
        return res.status(400).json({
          message:
            "Invalid password",
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.json({
        token,
        user,
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
        await User.find();

      res.json(users);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);

module.exports = router;