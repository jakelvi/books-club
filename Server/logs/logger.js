import chalk from "chalk";

class Logger {
  static success(...message) {
    console.log(chalk.italic.green(...message));
  }

  static error(...message) {
    console.error(chalk.red(...message));
  }

  static info(...message) {
    if (process.env.NODE_ENV !== "production") return;
    console.info(chalk.yellow(...message));
  }

  static debug(...message) {
    console.debug(chalk.blue(...message));
  }

  static log(...message) {
    if (process.env.NODE_ENV === "prod") return;
    console.log(...message);
  }

  static verbose(...message) {
    if (process.env.NODE_ENV === "prod") return;
    console.log(chalk.magenta(...message));
  }
}

export default Logger;
