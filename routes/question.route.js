import { Router } from "express";
import {
  create,
  destroy,
  findAllByQuizId,
  findByQuizAndUser,
  findOne,
  update,
} from "../controllers/question.controller.js";
import {
  validateQuestionSchema,
  validateUpdateQuestionSchema,
} from "../middlewares/validators.js";
import classroomAccess from "../middlewares/classroomAccess.js";

const questionRoute = Router();

// POST ON PRIVATE QUIZ
questionRoute.post(
  "/:classroomId",
  classroomAccess,
  validateQuestionSchema,
  create
);

// POST ON PUBLIC QUIZ

// find all question by quiz id
questionRoute.get(
  "/:classroomId/quiz/:quizId",
  classroomAccess,
  findAllByQuizId
);

// find one question
questionRoute.get("/:classroomId/:questionId", classroomAccess, findOne);

questionRoute.put(
  "/:classroomId/:questionId",
  classroomAccess,
  validateUpdateQuestionSchema,
  update
);
questionRoute.delete("/:classroomId/:questionId", classroomAccess, destroy);
questionRoute.get("/quiz/:quizId", classroomAccess, findByQuizAndUser);

export default questionRoute;
