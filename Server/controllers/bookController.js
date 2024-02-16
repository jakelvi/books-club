import BookModel from "../database/models/bookModel.js";
import likeSchema from "../validation/book.joi.js";
import Logger from "../logs/logger.js";
import ErrorsMes from "../error/errorsMessenger.js";
import errorHandler from "../middleware/errorHandler.js";

// post like:
export async function toggleLike(req, res) {
  try {
    // const { error } = likeSchema.validate(req.body);
    // if (error) {
    //   throw new ErrorsMes(error.details[0].message, 400);
    // }

    const { bookId, userId } = req.body;
    const username = req.username;
    const isAdmin = req.isAdmin;
    if (!bookId || !userId) {
      throw new ErrorsMes("Both bookId and userId are required", 400);
    }
    let book = await BookModel.findOne({ _id: bookId });
    if (!book) {
      const newBook = new BookModel({ _id: bookId, likes: [] });
      book = await newBook.save();
    }
    const existingLike = book.likes.find(
      (like) => like.userId.toString() === userId
    );
    const likeEntry = {
      userId,
      username,
      isAdmin,
      bookId,
    };
    if (existingLike) {
      if (book.likes.length > 0) {
        book.likes = book.likes.filter(
          (like) => like.userId.toString() !== userId
        );
      } else {
        book.likes.push(likeEntry);
      }
    } else {
      book.likes.push(likeEntry);
    }
    const updatedBook = await book.save();
    Logger.success("Toggle Like successful");
    return res.status(200).json(updatedBook);
  } catch (error) {
    Logger.error("Toggle Like was unsuccessfull");
    errorHandler(error, res);
  }
}

// post favorite:
export async function toggleFavorite(req, res) {
  try {
    const { bookId, userId } = req.body;
    const username = req.username;
    const isAdmin = req.isAdmin;
    if (!bookId || !userId) {
      throw new ErrorsMes("Both bookId and userId are required", 400);
    }
    let book = await BookModel.findOne({ _id: bookId });
    if (!book) {
      const newBook = new BookModel({ _id: bookId, favorites: [] });
      book = await newBook.save();
    }
    const existingFavorite = book.favorites.find(
      (favorite) => favorite.userId.toString() === userId
    );
    const favoriteEntry = {
      userId,
      username,
      isAdmin,
      bookId,
    };
    if (existingFavorite) {
      if (book.favorites.length > 0) {
        book.favorites = book.favorites.filter(
          (favorite) => favorite.userId.toString() !== userId
        );
      } else {
        book.favorites.push(favoriteEntry);
      }
    } else {
      book.favorites.push(favoriteEntry);
    }
    const updatedBook = await book.save();
    Logger.success("Toggle Favorite successful");
    return res.status(200).json(updatedBook);
  } catch (error) {
    Logger.error("Toggle Favorite Error:", error);
    errorHandler(error, res);
  }
}

// post critique:
export async function addCritique(req, res) {
  try {
    const { bookId, text, userId, stars } = req.body;
    const username = req.username;
    const isAdmin = req.isAdmin;
    if (!bookId || !userId || !text) {
      throw new ErrorsMes("bookId, userId, and text are required", 400);
    }
    let book = await BookModel.findOne({ _id: bookId });
    if (!book) {
      const newBook = new BookModel({ _id: bookId, critiques: [] });
      book = await newBook.save();
    }
    const critiqueEntry = {
      bookId,
      userId,
      username,
      isAdmin,
      text,
      stars: stars || 0,
    };
    book.critiques.push(critiqueEntry);
    const updatedBook = await book.save();
    Logger.success("Add Critique successful");
    return res.status(200).json(updatedBook);
  } catch (error) {
    Logger.error("Add Critique Error:", error);
    errorHandler(error, res);
  }
}

// admin gets all books
export async function adminGetsAllBooks(req, res) {
  try {
    if (!req.isAdmin) {
      throw new ErrorsMes("Unauthorized user", 401);
    }
    const books = await BookModel.find({}).populate([
      {
        path: "likes",
        select: "userId booksId",
      },
      {
        path: "favorites",
        select: "userId booksId",
      },
      {
        path: "critiques",
        select: "userId booksId text",
      },
    ]);
    Logger.success("Admin Gets All Books successful");
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    Logger.error("Admin Gets All Books Error:", error);
    errorHandler(error, res);
  }
}

// get favorite books by userId
export async function getFavoriteBooksByUserId(req, res) {
  try {
    const username = req.headers.username;
    if (!req.isAdmin && username !== req.user._id.toString()) {
      throw new ErrorsMes("Unauthorized user", 401);
    }
    const books = await BookModel.find({
      "favorites.userId": userId,
    });
    Logger.success("Get Favorite Books By UserId successful");
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    Logger.error("Get Favorite Books By UserId Error:", error);
    errorHandler(error, res);
  }
}

//put update critique:
export async function updateCritique(req, res) {
  try {
    const { bookId, text, stars, userId } = req.body;
    const username = req.username;

    if (!bookId || !text) {
      throw new ErrorsMes("bookId, and text are required", 400);
    }

    let book = await BookModel.findOne({ _id: bookId });

    if (!book) {
      throw new ErrorsMes("This book does not exist", 400);
    }
    const existingCritique = book.critiques.find(
      (critique) => critique.userId.toString() === userId.toString()
    );

    if (!existingCritique) {
      throw new ErrorsMes("There is not critique.", 400);
    }

    existingCritique.text = text;
    existingCritique.stars = stars || 0;
    existingCritique.username = username;

    const updatedBook = await book.save();
    Logger.success("Add Critique successful");
    return res.status(200).json(updatedBook);
  } catch (error) {
    Logger.error("Add Critique Error:", error);
    errorHandler(error, res);
  }
}

//delete critique:
export async function deleteCritique(req, res) {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      throw new ErrorsMes(
        "userId and bookId are essential for the deletion of the critique.",
        400
      );
    }

    const result = await BookModel.updateOne(
      { _id: bookId },
      { $pull: { critiques: { userId: userId } } }
    );

    if (result.nModified === 0) {
      throw new ErrorsMes("This critique does not exist", 404);
    }

    Logger.success("Delete Critique successful");
    return res.status(200).json({ message: "Critique deleted successfully" });
  } catch (error) {
    Logger.error("Delete Critique Error:", error);
    errorHandler(error, res);
  }
}
