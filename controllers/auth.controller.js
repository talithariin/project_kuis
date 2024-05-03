import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // cek apakah akun sudah terdaftar
    const user = await User.findByUsername(username);

    if (!user) {
      return next(new Error("User_Not_Registered"));
    }

    // user sudah terdaftar, lalu cek password
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
  } catch (error) {
    next(new Error("Internal_Server_Error"));
  }
};

export const register = async (req, res, next) => {
  try {
    const userExist = await User.findByUsername(req.body.username);
    console.log(`User exist ${userExist}`);

    if (userExist) {
      return next(new Error("Username_Already_Exist"));
    }

    const encryptPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: encryptPassword,
      full_name: req.body.full_name,
      address: req.body.address,
      birthdate: req.body.birthdate,
    };

    const createdUser = await User.create(newUser);
    res.send(createdUser);
  } catch (error) {
    console.log(error);
    next(new Error("Internal_Server_Error"));
  }
};
