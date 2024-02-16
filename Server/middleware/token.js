import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
  const payload = {
    username: user.username,
    isAdmin: user.isAdmin,
  };

  const options = {
    expiresIn: "24h",
  };

  const secret = process.env.JWT_SECRET;

  return jwt.sign(payload, secret, options);
};

const decodeToken = (token) => {
  const secret = process.env.JWT_SECRET;

  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    console.log("Decoding Token:", tokenWithoutBearer);
    const decoded = jwt.verify(tokenWithoutBearer, secret);
    console.log("Decoded Token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error.message);
    return null;
  }
};

export { decodeToken, generateToken };
