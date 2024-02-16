import morgan from "morgan";
import Logger from "./logger.js";

// Create a custom stream for Morgan to use
const morganStream = {
  write: (message) => {
    Logger.logInfo(message.trim());
  },
};

// Morgan middleware setup
const morganMiddleware = morgan("dev", { stream: morganStream });

export default morganMiddleware;
