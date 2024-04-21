import User from "../models/User.js";

export const update = async (req, res, next) => {
  const userExist = await new Promise((resolve, reject) => {
    User.findByUsername(req.body.username, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          resolve(false);
        } else {
          reject(err);
        }
      } else {
        resolve(true);
      }
    });
  });

  const updateData = {};
  if (req.body.username) updateData.username = req.body.username;
  if (req.body.email) updateData.email = req.body.email;
  if (req.body.full_name) updateData.full_name = req.body.full_name;
  if (req.body.address) updateData.address = req.body.address;
  if (req.body.birthdate) updateData.birthdate = req.body.birthdate;

  User.update(req.params.id, updateData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        return next(new Error("User_Not_Found"));
      } else {
        console.log(err);
        return res.status(500).send({
          message: `error woy`,
        });
      }
    } else {
      if (userExist) {
        return next(new Error("Username_Already_Exist"));
      }
      res.send(data);
    }
  });
};

export const findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err) {
      return next(new Error("Internal_Server_Error"));
    }
    res.send(data);
  });
};

export const findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        return res.status(404).send({
          message: `Not found user with id : ${req.params.id}`,
        });
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    } else {
      res.send(data);
    }
  });
};

export const destroy = (req, res) => {
  User.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found user with id : ${req.params.id}`,
        });
      } else {
        res.status(500).send({ msg: "Exist some error" });
      }
    } else {
      res.send({ msg: "Success delete user" });
    }
  });
};
