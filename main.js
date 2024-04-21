import express from "express";
import dotenv from "dotenv";
import connection from "./models/connection.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoute from "./routes/auth.route.js";
import authJwt from "./middlewares/authJwt.js";
import profileRoute from "./routes/profile.route.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", authJwt, (req, res) => {
  res.json({ msg: "Selamat Datang di Program Kuis Asoy" });
});
app.use("/auth", authRoute);
app.use("/profile", authJwt, profileRoute);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

connection.getConnection((err) => {
  if (err) {
    console.log("Error connecting to MySQL : ", err);
    server.close();
  } else {
    console.log("Connected to MySQL successfully");
  }
});