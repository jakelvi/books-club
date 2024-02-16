import bcrypt from "bcrypt";
import { UserModel } from "../database/models/userModel.js";
import { generateToken, decodeToken } from "../middleware/token.js";
import {
  registerValidationSchema,
  loginValidateSchema,
  updateValidationSchema,
} from "../validation/user.joi.js";
import errorHandler from "../middleware/errorHandler.js";
import Logger from "../logs/logger.js";
import ErrorsMes from "../error/errorsMessenger.js";

export async function register(req, res) {
  try {
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      throw new ErrorsMes(error.details[0].message, 400);
    }

    const { username, email, isAdmin } = req.body; // Exclude password from req.body

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new ErrorsMes(`Username '${username}' already exists`, 400);
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      throw new ErrorsMes(`Email '${email}' is already registered`, 400);
    }
    const user = new UserModel({
      username,
      password,
      email,
      isAdmin,
    });

    await user.save();

    const { password: _, ...userWithoutPassword } = user.toObject(); // Exclude password from user object
    Logger.success("User registered successfully", 201);
    res.status(201).json({
      msg: "User registered successfully",
      user: userWithoutPassword,
      isAdmin,
    }); // Include isAdmin in the response
  } catch (error) {
    Logger.error("Registration Error:", error);
    errorHandler(error, res);
  }
}

export async function login(req, res) {
  try {
    const { error } = loginValidateSchema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error(`Username '${username}' was not found`);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Password does not match");
    }
    const token = generateToken(user);
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      throw new Error("Invalid token");
    }
    return res.status(200).json({
      message: "Login successful",
      id: decodedToken.userId,
      token,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    // Return error response
    return res.status(400).json({ error: error.message });
  }
}

export async function verifyUser(req, res, next) {
  try {
    const { username } = req;
    const userExist = await UserModel.findOne({ username });
    if (!userExist)
      throw new ErrorsMes(`Username '${username}' was not found`, 404);
    req.userExist = userExist;
    Logger.success("Username was verified successfully", 200);
    next();
  } catch (error) {
    Logger.error("Error during verification of the user:", error);
    errorHandler(error, res);
  }
}

export async function getUser(req, res) {
  const { username } = req;

  try {
    if (!username) throw new ErrorsMes("Invalid username", 400);

    const user = await UserModel.findOne({ username });

    if (!user) throw new ErrorsMes(`Username '${username}' was not found`, 404);

    const { password, ...rest } = user.toObject();

    Logger.success("User was found successfully", 200);
    return res.status(200).json({ msg: "User was found successfully", rest });
  } catch (error) {
    Logger.error("Error fetching user data:", error);
    errorHandler(error, res);
  }
}

export async function updateUser(req, res) {
  try {
    const { username } = req;

    if (!username) {
      throw new ErrorsMes("Invalid username", 400);
    }

    const body = req.body;

    const validationResult = updateValidationSchema.validate(body);

    if (validationResult.error) {
      throw new ErrorsMes(validationResult.error.message, 400);
    }
    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      throw new ErrorsMes("Couldn't find the user or user doesn't exist", 404);
    }

    existingUser.set(body);
    const updatedUser = await existingUser.save();

    Logger.success("User Updated successfully", 201);

    return res
      .status(201)
      .json({ msg: "User was updated successfully", updatedUser });
  } catch (error) {
    Logger.error("Error updating user:", error);
    errorHandler(error, res);
  }
}

export async function getAllUsers(req, res) {
  try {
    if (!req.isAdmin) {
      throw new ErrorsMes("Unauthorized user", 401);
    }

    const users = await UserModel.find({}, { password: 0 });

    return res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { username } = req;
    if (!username) {
      throw new ErrorsMes("User was not found in the request", 400);
    }
    const deletedUser = await UserModel.findOne({ username });
    if (!deletedUser) {
      throw new ErrorsMes("User not found", 404);
    }

    const result = await UserModel.deleteOne({ username: username });
    if (result.deletedCount === 0) {
      throw new ErrorsMes("Couldn't access the user", 404);
    }
    Logger.success("User deleted successfully", 200);
    return res.status(200).json({
      deletedUser: {
        _id: deletedUser._id,
        username: deletedUser.username,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    Logger.error("Error deleting user:", error, 400);
    errorHandler(error, res);
  }
}
