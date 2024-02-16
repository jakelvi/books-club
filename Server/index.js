import express from "express";
import cors from "cors";
import morgan from "morgan";
import configDotEnv from "./config/index.js";
import { connect } from "./database/connection.js";
import { usersRouter, booksRouter } from "./routes/router.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

configDotEnv();
connect();

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.static("public"));
app.use(morgan("dev"));
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/books", booksRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(5050);
