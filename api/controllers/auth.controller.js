import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username is already taken",
        error: "Bad Request",
        success: false,
        statusCode: 400,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email is already registered",
        error: "Bad Request",
        success: false,
        statusCode: 400,
      });
    }

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({
      message: "User created successfully",
      error: "false",
      success: true,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser)
      return res.status(404).json({
        message: "wrong username or password",
        success: false,
        statusCode: 404,
      });

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    return res.status(404).json({
      message: "wrong username or password",
      success: false,
      statusCode: 404,
    });

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
