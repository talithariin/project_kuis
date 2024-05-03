import User from "../models/User.js";
import bcrypt from "bcrypt";

export const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    let data = req.body;

    // Check if password field exists and encrypt it
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    const updatedUser = await User.update(id, data);

    res.send(updatedUser);
  } catch (error) {
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found user with id : ${req.params.id}`,
      });
    } else {
      console.log(error);
      next(new Error("Internal_Server_Error"));
    }
  }
};

export const findAll = async (req, res, next) => {
  try {
    const data = await User.getAll();
    res.send(data);
  } catch (error) {
    next(new Error("Internal_Server_Error"));
  }
};

export const findOne = async (req, res, next) => {
  try {
    const userData = await User.findById(req.params.id);
    if (!userData) {
      return res.status(404).send({
        message: `Not found user with id : ${req.params.id}`,
      });
    }
    res.send(userData);
  } catch (error) {
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found user with id : ${req.params.id}`,
      });
    } else {
      next(new Error("Internal_Server_Error"));
    }
  }
};

export const destroy = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({
        message: `Not found user with id : ${id}`,
      });
    }

    await User.delete(id);

    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    if (error.type === "not_found") {
      res.status(404).send({
        message: `Not found user with id : ${req.params.id}`,
      });
    } else {
      next(new Error("Internal_Server_Error"));
    }
  }
};
