const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("Extracted Token:", token);

  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    // 👇 Print the whole decoded token
    console.log("Decoded Token:", decoded);

    req.userID = decoded.userID;
    req.userRole = decoded.role;
    req.classID = decoded.class_id;

    next();
  });
};

module.exports = verifyToken;