export const requireModerator = (req, res, next) => {
    if (req.user.role !== "MODERATOR") {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }
  
    next();
  };
  