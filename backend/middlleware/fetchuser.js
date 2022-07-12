var jwt = require("jsonwebtoken");
const JWT_SECRET = "Simantaisa$goodboy";

const fetchuser = (req, res, next) => {
  // Get the user from the jwt token and id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate with valid token" });
    const string = jwt.verify(token, "");
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate with valid token" });
  }
};

module.exports = fetchuser;
