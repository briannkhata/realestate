import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

import { errorHandler } from "../../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res
        .status(400)
        .json({
          message: "Username is already taken",
          error: "Bad Request",
          statusCode: 400,
        });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({
          message: "Email is already registered",
          error: "Bad Request",
          statusCode: 400,
        });
    }

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};
