const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.status(403).json({ message: "Authorization token expired" });
    jwt.verify(token, process.env.MONGO_SECRET_KEY, (err, user) => {
      if (err)
        return res.status(403).json({ message: "Authorization token expired" });

      req.user = user;
    });
    next();
  } catch (error) {
    return res.status(403).json({ message: "Authorization token expired" });
  }
};
