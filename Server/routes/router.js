import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { validateToken } from "../middleware/tokenValidation.js";
import { isAdmin } from "../middleware/isAdmin.js";
import * as booksController from "../controllers/bookController.js";

const usersRouter = Router();
const booksRouter = Router();

//UsersRouter:

/**Post Methods */
usersRouter.route("/register").post(userController.register);
usersRouter.route("/login").post(userController.login);

/**Get Methods */
usersRouter
  .route("/getUser")
  .get(validateToken, userController.verifyUser, userController.getUser);

usersRouter
  .route("/getAllUsers")
  .get(validateToken, isAdmin, userController.getAllUsers);

/**Put Methods */
usersRouter
  .route("/updateuser")
  .put(validateToken, userController.verifyUser, userController.updateUser);

/**Delete Method */
usersRouter
  .route("/deleteUser")
  .delete(userController.verifyUser, userController.deleteUser);

//BooksRouter:
/**Post: */
booksRouter
  .route("/toggleLike")
  .post(validateToken, booksController.toggleLike);
booksRouter
  .route("/toggleFavorite")
  .post(validateToken, booksController.toggleFavorite);
booksRouter
  .route("/createCritique")
  .post(validateToken, booksController.addCritique);

/**Get: */
booksRouter
  .route("/getAllBooks")
  .get(validateToken, isAdmin, booksController.adminGetsAllBooks);
booksRouter
  .route("/getFavorites")
  .get(validateToken, booksController.getFavoriteBooksByUserId);

/**Put: */
booksRouter
  .route("/updateCritique")
  .put(validateToken, booksController.updateCritique);

/**Delete: */
booksRouter
  .route("/deleteCritique")
  .delete(validateToken, booksController.deleteCritique);

export { usersRouter, booksRouter };
