import Quiz from "../models/Quiz.js";
import Classroom from "../models/Classroom.js";
import User from "../models/User.js";
import { findOne as findClassroomById } from "./classroom.controller.js";

export const createPrivateQuiz = async (req, res, next) => {
  const userId = req.userId;
  const classroomId = req.params.classroomId;

  try {
    const classroom = await Classroom.findById(classroomId);

    const ownerId = classroom.owner_id;

    if (userId !== ownerId) {
      return next(new Error("Create_Quiz_Permission"));
    }

    const newQuiz = {
      name: req.body.name,
      is_public: false,
      classroom_id: classroomId,
    };

    const data = await Quiz.create(newQuiz);

    res.send(data);
  } catch (error) {
    console.log("Error:", error);
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found classroom with id : ${req.params.classroomId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const createPublicQuiz = async (req, res, next) => {
  const newQuiz = {
    name: req.body.name,
    is_public: true,
    classroom_id: null,
  };

  try {
    const data = await Quiz.create(newQuiz);
    res.send(data);
  } catch (error) {
    console.log(error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const findAll = async (req, res, next) => {
  try {
    const quizData = await Quiz.getAll();

    const quizzesWithClassrooms = await Promise.all(
      quizData.map(async (quiz) => {
        try {
          const classroomData = await Classroom.findById(quiz.classroom_id);
          const classroom = classroomData ? classroomData : null;
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
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const findAllQuizPublic = async (req, res, next) => {
  try {
    const quizData = await Quiz.getAllPublicQuiz();

    const quizzesWithClassrooms = await Promise.all(
      quizData.map(async (quiz) => {
        try {
          const classroomData = await Classroom.findById(quiz.classroom_id);
          const classroom = classroomData ? classroomData : null;
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
  } catch (error) {
    console.log("Error:", error);
    if (error.type === "not_found") {
      return next(new Error("Quiz_Not_Found"));
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const findOne = async (req, res, next) => {
  try {
    const quizData = await Quiz.findById(req.params.id);
    console.log(quizData);

    if (!quizData) {
      return res.status(404).send({
        message: `Not found quiz with id : ${req.params.id}`,
      });
    }

    const classroomId = quizData.classroom_id;

    const classroom = await Classroom.findById(classroomId);

    res.send({
      ...quizData,
      classroom,
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const getQuizByUserId = async (req, res, next) => {
  try {
    const user_id = req.userId;
    const quizData = await Quiz.findByUserId(user_id);

    if (quizData.length === 0) {
      res.send(quizData);
      return;
    }

    const quizWithClassroom = await Promise.all(
      quizData.map(async (quiz) => {
        try {
          const classroomData = await Classroom.findById(quiz.classroom_id);
          quiz.classroom = classroomData;
          return quiz;
        } catch (classroomErr) {
          throw classroomErr;
        }
      })
    );

    res.send(quizWithClassroom);
  } catch (error) {
    console.log("Error:", error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const update = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.userId;
    const classroomId = req.params.classroomId;
    console.log(quizId, userId, classroomId);

    const classroomData = await Classroom.findById(classroomId);
    if (!classroomData) {
      return res.status(404).send({
        message: `Not found classroom with id : ${req.params.classroomId}`,
      });
    }

    const ownerId = classroomData.owner_id;

    if (userId !== ownerId) {
      return next(new Error("Update_Quiz_Permission"));
    }

    const quizData = {
      name: req.body.name,
    };

    const updatedQuizData = await Quiz.update(quizId, quizData);

    res.send(updatedQuizData);
  } catch (error) {
    console.log("Error:", error);
    if (error.type === "not_found") {
      res.status(404).send({
        message: `Not found quiz with id : ${req.params.quizId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const destroy = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.userId;
    const classroomId = req.params.classroomId;

    const classroomData = await Classroom.findById(classroomId);
    if (!classroomData) {
      return res.status(404).send({
        message: `Not found classroom with id : ${req.params.classroomId}`,
      });
    }

    const ownerId = classroomData.owner_id;

    if (userId !== ownerId) {
      return next(new Error("Delete_Quiz_Permission"));
    }

    await Quiz.delete(quizId);

    res.send({ msg: "Success delete quiz" });
  } catch (error) {
    console.log("Error:", error);
    if (error.type === "not_found") {
      res.status(404).send({
        message: `Not found quiz with id : ${req.params.quizId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
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

export const destroyPublicQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;

    await Quiz.delete(quizId);

    res.send({ msg: "Success delete public quiz" });
  } catch (error) {
    console.log("Error:", error);
    if (error.type === "not_found") {
      res.status(404).send({
        message: `Not found public quiz with id : ${quizId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};
