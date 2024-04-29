import Quiz from "../models/Quiz.js";
import Classroom from "../models/Classroom.js";
import User from "../models/User.js";
import { findOne as findClassroomById } from "./classroom.controller.js";

export const createPrivateQuiz = (req, res, next) => {
  const userId = req.userId;
  const classroomId = req.params.classroomId;

  Classroom.findById(classroomId, (err, data) => {
    if (err) {
      console.log("Error:", err);
      return next(new Error("Internal_Server_Error"));
    }

    if (!data) {
      return res.status(404).send({
        message: `Not found classroom with id : ${classroomId}`,
      });
    }

    const ownerId = data.owner_id;

    if (userId !== ownerId) {
      return next(new Error("Create_Quiz_Permission"));
    }

    const newQuiz = new Quiz({
      name: req.body.name,
      is_public: false,
      classroom_id: classroomId,
    });

    Quiz.create(newQuiz, (err, data) => {
      if (err) {
        console.log(err);
        return next(new Error("Internal_Server_Error"));
      }
      res.send(data);
    });
  });
};

export const createPublicQuiz = (req, res, next) => {
  const newQuiz = new Quiz({
    name: req.body.name,
    is_public: true,
    classroom_id: null,
  });

  Quiz.create(newQuiz, (err, data) => {
    if (err) {
      console.log(err);
      return next(new Error("Internal_Server_Error"));
    }
    res.send(data);
  });
};

export const findAll = async (req, res, next) => {
  try {
    Quiz.getAll(async (err, quizData) => {
      if (err) {
        console.log(err);
        return next(new Error("Internal_Server_Error"));
      }

      const quizzesWithClassrooms = await Promise.all(
        quizData.map(async (quiz) => {
          try {
            const classroom = await new Promise((resolve, reject) => {
              findClassroomById(
                { params: { id: quiz.classroom_id } },
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

export const findAllQuizPublic = async (req, res, next) => {
  try {
    Quiz.getAllPublicQuiz((err, quizData) => {
      if (err) {
        if (err.type === "not_found") {
          return next(new Error("Quiz_Not_Found"));
        } else {
          return next(new Error("Internal_Server_Error"));
        }
      }

      Promise.all(
        quizData.map((quiz) => {
          return new Promise(async (resolve, reject) => {
            try {
              const classroom = await new Promise((resolve, reject) => {
                findClassroomById(
                  { params: { id: quiz.classroom_id } },
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
              resolve({
                id: quiz.id,
                name: quiz.name,
                is_public: quiz.is_public,
                classroom,
              });
            } catch (error) {
              console.log("Error fetching classroom data:", error);
              resolve({
                id: quiz.id,
                name: quiz.name,
                is_public: quiz.is_public,
                classroom: null,
              });
            }
          });
        })
      )
        .then((quizzesWithClassrooms) => {
          res.send(quizzesWithClassrooms);
        })
        .catch((error) => {
          console.log("Error:", error);
          return next(new Error("Error_Fetching_Classroom"));
        });
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
          return next(new Error("Internal_Server_Error"));
        }
      } else {
        try {
          const classroom = await new Promise((resolve, reject) => {
            findClassroomById(
              { params: { id: quizData.classroom_id } },
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
          return next(new Error("Internal_Server_Error"));
        }
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const getQuizByUserId = async (req, res, next) => {
  try {
    const user_id = req.userId;
    Quiz.findByUserId(user_id, async (err, data) => {
      if (err) {
        return next(err);
      }

      if (data.length === 0) {
        res.send(data);
        return;
      }

      try {
        const quizWithClassroom = await Promise.all(
          data.map(async (quiz) => {
            await Classroom.findById(
              quiz.classroom_id,
              (classroomErr, classroomData) => {
                if (classroomErr) {
                  throw classroomErr;
                }
                quiz.classroom = classroomData;
              }
            );
            return quiz;
          })
        );

        res.send(quizWithClassroom);
      } catch (error) {
        console.log("Error:", error);
        return next(new Error("Internal_Server_Error"));
      }
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const update = (req, res, next) => {
  const quizId = req.params.quizId;
  const userId = req.userId;
  const classroomId = req.params.classroomId;

  Classroom.findById(classroomId, (err, classroomData) => {
    if (err) {
      console.log("Error:", err);
      return next(new Error("Internal_Server_Error"));
    }

    if (!classroomData) {
      return res.status(404).send({
        message: `Not found classroom with id : ${classroomId}`,
      });
    }

    const ownerId = classroomData.owner_id;

    if (userId !== ownerId) {
      return next(new Error("Update_Quiz_Permission"));
    }

    const quizData = new Quiz(req.body);
    Quiz.update(quizId, quizData, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          res.status(404).send({
            message: `Not found quiz with id : ${quizId}`,
          });
        } else {
          return next(new Error("Internal_Server_Error"));
        }
      } else {
        res.send(data);
      }
    });
  });
};

export const destroy = (req, res, next) => {
  const quizId = req.params.quizId;
  const userId = req.userId;
  const classroomId = req.params.classroomId;

  Classroom.findById(classroomId, (err, classroomData) => {
    if (err) {
      console.log("Error:", err);
      return next(new Error("Internal_Server_Error"));
    }

    if (!classroomData) {
      return res.status(404).send({
        message: `Not found classroom with id : ${classroomId}`,
      });
    }

    const ownerId = classroomData.owner_id;

    if (userId !== ownerId) {
      return next(new Error("Update_Quiz_Permission"));
    }

    Quiz.delete(quizId, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          res.status(404).send({
            message: `Not found quiz with id : ${quizId}`,
          });
        } else {
          return next(new Error("Internal_Server_Error"));
        }
      } else {
        res.send({ msg: "Success delete quiz" });
      }
    });
  });
};

export const updatePublicQuiz = (req, res, next) => {
  const quizId = req.params.quizId;

  const quizData = new Quiz(req.body);
  Quiz.update(quizId, quizData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found public quiz with id : ${quizId}`,
        });
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    } else {
      res.send(data);
    }
  });
};

export const destroyPublicQuiz = (req, res, next) => {
  const quizId = req.params.quizId;

  Quiz.delete(quizId, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found public quiz with id : ${quizId}`,
        });
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    } else {
      res.send({ msg: "Success delete public quiz" });
    }
  });
};
