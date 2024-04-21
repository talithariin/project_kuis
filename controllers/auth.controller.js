import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = (req, res, next) => {
  const { username, password } = req.body;
  //   cek apakah akun sudah terdaftar
  User.findByUsername(username, async (err, user) => {
    if (err) {
      if (err.type === "not_found") {
        // username tidak terdaftar
        return next(new Error("User_Not_Registered"));
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    }

    // user tidak ditemukan
    if (!user) {
      return next(new Error("User_Not_Registered"));
    }

    // user sudah terdaftar lalu cek password
    const userPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, userPassword);
    if (!isValidPassword) {
      return next(new Error("Invalid_Password"));
    }

    // password benar
    // parameter: (userInfo, secretKey, expiredTime)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.json({ token });
    // req.user = { token };
    // next();
  });
};

export const register = async (req, res, next) => {
  // check apakah username sudah dipakai
  const userExist = await new Promise((resolve, reject) => {
    User.findByUsername(req.body.username, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          // username belum terdaftar
          resolve(false);
        } else {
          // ada eror
          reject(err);
        }
      } else {
        // username sudah terdaftar
        resolve(true);
      }
    });
  });

  if (userExist) {
    return next(new Error("Username_Already_Exist"));
  }

  const encryptPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: encryptPassword,
    full_name: req.body.full_name,
    address: req.body.address,
    birthdate: req.body.birthdate,
  });

  User.create(newUser, (err, data) => {
    if (err) {
      return next(new Error("Internal_Server_Error"));
    }
    res.send(data);
  });
};
