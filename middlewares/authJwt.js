import jwt from "jsonwebtoken";
import roleAccess from "./roleAccess.js";

const authJwt = (req, res, next) => {
  // get token
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    return next(new Error("Missing_Token"));
  }
  console.log(token);
  console.log("Original URL:", req.originalUrl);
  console.log("URL:", req.url);

  //   verify token valid
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Invalid_Token"));
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    console.log(decoded.role);
    console.log(req.originalUrl);
    // jika tidak punya akses
    if (!roleAccess(decoded.role, req.originalUrl)) {
      return next(new Error("Unauthorized_Access"));
    }
    // Menambahkan pengecekan apakah pengguna hanya dapat memperbarui profil mereka sendiri
    if (req.method === "PUT" && req.originalUrl.startsWith("/profile/")) {
      const requestedUserId = parseInt(req.originalUrl.split("/")[2]);
      if (requestedUserId !== req.userId) {
        return next(new Error("Unauthorized_Access"));
      }
    }
    next();
  });
};

export default authJwt;
