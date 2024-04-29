import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import Classroom from "../models/Classroom.js";

export const create = (req, res, next) => {
  const newQuestion = new Question({
    question_text: req.body.question_text,
    options: req.body.options,
    answer_key: req.body.answer_key,
    quiz_id: req.body.quiz_id,
  });

  Question.create(newQuestion, (err, data) => {
    if (err) {
      console.log(err);
      return next(new Error("Internal_Server_Error"));
    }
    res.send(data);
  });
};

export const findAllByQuizId = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;

    Question.getAllByQuizId(quizId, async (err, data) => {
      if (err) {
        console.log(err);
        return next(new Error("Internal_Server_Error"));
      }

      if (data.length === 0) {
        return res.send([]);
      }

      const quiz = await new Promise((resolve, reject) => {
        Quiz.findById(quizId, (err, quiz) => {
          if (err) {
            reject(err);
          } else {
            resolve(quiz);
          }
        });
      });

      const mergedData = data.map((question) => {
        const options = JSON.parse(question.options);
        return {
          ...question,
          options: options,
          quiz: quiz,
        };
      });

      res.send(mergedData);
    });
  } catch (error) {
    console.error(error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const findOne = async (req, res, next) => {
  Question.findById(req.params.questionId, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found question with id : ${req.params.questionId}`,
        });
      } else {
        return next(new Error("Internal_Server_Error"));
      }
    } else {
      res.send(data);
    }
  });
};

export const update = (req, res, next) => {
  const questionData = new Question(req.body);
  Classroom.findById(req.params.classroomId, (err, classroom) => {
    if (err) {
      console.error("Error:", err);
      return next(new Error("Internal_Server_Error"));
    }

    if (!classroom) {
      return res.status(404).send({
        message: `Not found classroom with id : ${req.params.classroomId}`,
      });
    }

    if (req.userId !== classroom.owner_id) {
      return next(new Error("Update_Question_Permission"));
    }

    Question.update(req.params.questionId, questionData, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          res.status(404).send({
            message: `Not found question with id : ${req.params.questionId}`,
          });
        } else {
          console.log(err);
          return next(new Error("Internal_Server_Error"));
        }
      } else {
        res.send(data);
      }
    });
  });
};

export const destroy = (req, res, next) => {
  Classroom.findById(req.params.classroomId, (err, classroom) => {
    if (err) {
      console.error("Error:", err);
      return next(new Error("Internal_Server_Error"));
    }
    if (!classroom) {
      return res.status(404).send({
        message: `Not found classroom with id : ${req.params.classroomId}`,
      });
    }
    if (req.userId !== classroom.owner_id) {
      return next(new Error("Update_Question_Permission"));
    }
    Question.delete(req.params.questionId, (err, data) => {
      if (err) {
        if (err.type === "not_found") {
          res.status(404).send({
            message: `Not found question with id : ${req.params.questionId}`,
          });
        } else {
          return next(new Error("Internal_Server_Error"));
        }
      } else {
        res.send({ msg: "Success delete question" });
      }
    });
  });
};

export const findByQuizAndUser = (req, res, next) => {
  const { quizId } = req.params;
  const userId = req.userId;

  Question.findByQuizAndUser(quizId, userId, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found questions for quiz ID: ${quizId} and user ID: ${userId}`,
        });
      } else {
        res.status(500).send({ msg: "Error retrieving questions" });
      }
    } else {
      const questions = data.map((question) => {
        return {
          ...question,
          options: JSON.parse(question.options),
        };
      });
      res.send(questions);
    }
  });
};
