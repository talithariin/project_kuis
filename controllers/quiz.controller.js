import Quiz from "../models/Quiz.js";
import Classroom from "../models/Classroom.js";
import User from "../models/User.js";
import {
  findOne as findClassroomById,
  findAll as findAllClassrooms,
} from "./classroom.controller.js";

export const create = (req, res) => {
  if (req.body.is_public && !req.body.classroom_id) {
    req.body.classroom_id = null;
  }

  const newQuiz = new Quiz({
    name: req.body.name,
    is_public: req.body.is_public,
    classroom_id: req.body.classroom_id,
  });

  Quiz.create(newQuiz, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Exist some error" });
    }
    res.send(data);
  });
};

export const findAll = async (req, res, next) => {
  try {
    await findAllClassrooms(req, res, async (err, classroomsStudentsOwner) => {
      if (err) {
        console.log(err);
        return next(new Error("Internal_Server_Error"));
      }

      res.send(classroomsStudentsOwner);
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const findOne = async (req, res, next) => {
  try {
    await findClassroomById(req, res, async (err, classroomData) => {
      if (err) {
        return next(new Error("Internal_Server_Error")); // Menangani kesalahan internal server
      }

      const owner = await new Promise((resolve, reject) => {
        User.findById(classroomData.owner_id, (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });

      const quizExpanded = {
        id: req.params.id,
        owner,
      };

      res.send(quizExpanded);
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const update = (req, res) => {
  const quizData = new Quiz(req.body);
  Quiz.update(req.params.id, quizData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found quiz with id : ${req.params.id}`,
        });
      } else {
        res.status(500).send({ msg: "Exist some error" });
      }
    } else {
      res.send(data);
    }
  });
};

export const destroy = (req, res) => {
  Quiz.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found quiz with id : ${req.params.id}`,
        });
      } else {
        res.status(500).send({ msg: "Exist some error" });
      }
    } else {
      res.send({ msg: "Success delete quiz" });
    }
  });
};
