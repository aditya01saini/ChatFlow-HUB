const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(404).json({ error: "Admin access only" });
};

export default adminOnly;
