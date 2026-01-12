import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Expected format: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token missing",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "default_secret",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token",
        });
      }

      // Attach user info to request
      req.user = user;
      next();
    }
  );
};
