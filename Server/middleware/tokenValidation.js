import { decodeToken } from "./token.js";

// tokenValidation.js

async function validateToken(req, res, next) {
  const token = req.headers.authorization;
  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token not provided." });
  }

  try {
    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }

    req._id = decoded._id;
    req.username = decoded.username;
    req.isAdmin = decoded.isAdmin;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
}

export { validateToken };
