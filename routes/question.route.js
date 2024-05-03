import { Router } from "express";
import {
  create,
  destroy,
  findAllByQuizId,
  findOne,
  update,
} from "../controllers/question.controller.js";
import { validateQuestionSchema } from "../middlewares/validators.js";
import classroomAccess from "../middlewares/classroomAccess.js";

const questionRoute = Router();

// POST ON PRIVATE QUIZ
questionRoute.post(
  "/:classroomId/:quizId",
  classroomAccess,
  validateQuestionSchema,
  create
);

// POST ON PUBLIC QUIZ
questionRoute.post("/:quizId", validateQuestionSchema, create);

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
  validateQuestionSchema,
  update
);
questionRoute.delete("/:classroomId/:questionId", classroomAccess, destroy);

export default questionRoute;
