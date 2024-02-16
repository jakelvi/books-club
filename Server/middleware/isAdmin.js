import Logger from "../logs/logger.js";
import errorHandler from "./errorHandler.js";
import ErrorsMes from "../error/errorsMessenger.js";
import { UserModel } from "../database/models/userModel.js";

export async function isAdmin(req, res, next) {
  const { username } = req;

  try {
    if (!username) {
      throw new ErrorsMes("Invalid username", 400);
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new ErrorsMes("User not found", 404);
    }
    req.isAdmin = user.isAdmin || false;

    Logger.success("User is admin", 201);
    next();
  } catch (error) {
    Logger.error("User is not authorized", 401);
    errorHandler(error, res);
  }
}
