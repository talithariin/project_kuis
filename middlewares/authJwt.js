import jwt from "jsonwebtoken";
import roleAccess from "./roleAccess.js";

const authJwt = (req, res, next) => {
  // get token
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return next(new Error("Missing_Token"));
  }
  //   verify token valid
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Invalid_Token"));
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    // console.log(`Id ${req.userId}`);
    // console.log(`Role ${req.role}`);
    // console.log(`Req original Url ${req.originalUrl}`);
    // console.log(`Req url ${req.url}`);

    if (
      !roleAccess(
        decoded.role,
        req.originalUrl,
        req.method,
        req.userId,
        req.url
      )
    ) {
      return next(new Error("Unauthorized_Access"));
    }
    next();
  });
};

export default authJwt;
