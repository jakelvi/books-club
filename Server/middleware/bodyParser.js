// body-parser.js

const bodyParser = (req, res, next) => {
  if (req.header("content-type") !== "application/json") {
    return next();
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      req.body = JSON.parse(body);
      next();
    } catch (e) {
      console.error(e); // Log the parsing error for debugging
      res.status(400).json({ message: "Invalid Json" });
    }
  });
};

export default bodyParser;
export { bodyParser };
