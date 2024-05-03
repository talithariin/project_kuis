import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import Classroom from "../models/Classroom.js";

export const create = async (req, res, next) => {
  try {
    const newQuestion = {
      question_text: req.body.question_text,
      options: req.body.options,
      answer_key: req.body.answer_key,
      quiz_id: req.params.quizId,
    };

    const data = await Question.create(newQuestion);
    res.send(data);
  } catch (error) {
    console.log(error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const findAllByQuizId = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId);

    const questions = await Question.getAllByQuizId(quizId);

    res.send(questions);
  } catch (error) {
    console.log("Error:", error);
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found quiz with id : ${req.params.quizId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const findOne = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).send({
        message: `Not found question with id : ${req.params.questionId}`,
      });
    }
    res.send(question);
  } catch (error) {
    console.error(error);
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found question with id : ${req.params.questionId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const update = async (req, res, next) => {
  try {
    const questionData = req.body;
    const classroom = await Classroom.findById(req.params.classroomId);

    if (!classroom) {
      return res.status(404).send({
        message: `Not found classroom with id : ${req.params.classroomId}`,
      });
    }

    if (req.userId !== classroom.owner_id) {
      return next(new Error("Update_Question_Permission"));
    }

    const data = await Question.update(req.params.questionId, questionData);
    res.send(data);
  } catch (error) {
    console.error(error);
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found question with id : ${req.params.questionId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};

export const destroy = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.classroomId);

    if (!classroom) {
      return res.status(404).send({
        message: `Not found classroom with id : ${req.params.classroomId}`,
      });
    }

    if (req.userId !== classroom.owner_id) {
      return next(new Error("Update_Question_Permission"));
    }

    const data = await Question.delete(req.params.questionId);
    res.send(data);
  } catch (error) {
    console.error(error);
    if (error.type === "not_found") {
      return res.status(404).send({
        message: `Not found question with id : ${req.params.questionId}`,
      });
    } else {
      return next(new Error("Internal_Server_Error"));
    }
  }
};
