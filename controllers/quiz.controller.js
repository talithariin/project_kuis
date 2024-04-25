import Quiz from "../models/Quiz.js";
import Classroom from "../models/Classroom.js";
import User from "../models/User.js";
import { findOne as findClassroomById } from "./classroom.controller.js";

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
    Quiz.getAll(async (err, quizData) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Exist some error" });
      }

      const quizzesWithClassrooms = await Promise.all(
        quizData.map(async (quiz) => {
          try {
            // Panggil fungsi findClassroomById untuk mendapatkan data kelas berdasarkan classroom_id
            const classroom = await new Promise((resolve, reject) => {
              findClassroomById(
                { params: { id: quiz.classroom_id } },
                // Gunakan res.send() sebagai resolve agar tidak langsung mengirimkan respons
                { send: (classroomData) => resolve(classroomData) },
                (err, classroomData) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(classroomData);
                  }
                }
              );
            });
            // Mengembalikan objek yang berisi informasi kuis dan kelas
            return {
              id: quiz.id,
              name: quiz.name,
              is_public: quiz.is_public,
              classroom,
            };
          } catch (error) {
            console.log("Error fetching classroom data:", error);
            return {
              id: quiz.id,
              name: quiz.name,
              is_public: quiz.is_public,
              classroom: null,
            };
          }
        })
      );

      res.send(quizzesWithClassrooms);
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const findOne = async (req, res, next) => {
  try {
    Quiz.findById(req.params.id, async (err, quizData) => {
      if (err) {
        if (err.type === "not_found") {
          res.status(404).send({
            message: `Not found quiz with id : ${req.params.id}`,
          });
        } else {
          res.status(500).send({ msg: "Exist some error" });
        }
      } else {
        try {
          // Panggil fungsi findClassroomById untuk mendapatkan data kelas berdasarkan classroom_id
          const classroom = await new Promise((resolve, reject) => {
            findClassroomById(
              { params: { id: quizData.classroom_id } },
              // Gunakan res.send() sebagai resolve agar tidak langsung mengirimkan respons
              { send: (classroomData) => resolve(classroomData) },
              (err, classroomData) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(classroomData);
                }
              }
            );
          });

          res.send({
            ...quizData,
            classroom,
          });
        } catch (error) {
          console.log("Error fetching classroom data:", error);
          res.status(500).send({ msg: "Exist some error" });
        }
      }
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
