import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  let token = req.headers.authorization || req.query.token;
  if (token) {
    token = token.replace("Bearer ", "");
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      req.user = err ? null : decoded.user;
      req.exp = err ? null : new Date(decoded.exp * 1000);
      next();
    });
  } else {
    req.user = null;
    next();
  }
};

export default authenticate;
