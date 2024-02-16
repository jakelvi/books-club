import { config } from "dotenv";

const configDotEnv = () => {
  config({ path: "config/.env" });
  const mode = process.env.NODE_ENV || "development";
  console.log("App is running in", mode, "Mode");
  console.log("Config file:", `config/${mode}.env`);

  config({ path: `config/${mode}.env` });
};
export default configDotEnv;
export { configDotEnv };
