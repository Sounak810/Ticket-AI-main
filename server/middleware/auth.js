import { ACCESS_COOKIE_NAME, verifyAccessToken } from "../utils/auth.js";

export const authenticate = (req, res, next) => {
  const headerToken = req.headers.authorization?.split(" ")[1];
  const cookieToken = req.cookies?.[ACCESS_COOKIE_NAME];
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token found." });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};