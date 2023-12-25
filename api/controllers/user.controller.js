import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.send("Test Route");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req, body.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      req.body.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...others } = updatedUser._doc;
  } catch (error) {
    next(error);
  }
};
