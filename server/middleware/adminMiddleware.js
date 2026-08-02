const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access Denied. Admin Only",
    });
  }

  next();
};

module.exports = adminOnly;