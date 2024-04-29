import { Router } from "express";
import {
  createPrivateQuiz,
  createPublicQuiz,
  destroy,
  destroyPublicQuiz,
  findAll,
  findAllQuizPublic,
  findOne,
  getQuizByUserId,
  update,
  updatePublicQuiz,
} from "../controllers/quiz.controller.js";
import {
  validateQuizSchema,
  validateUpdateQuizSchema,
} from "../middlewares/validators.js";
import classroomAccess from "../middlewares/classroomAccess.js";

const quizRoute = Router();

// Membuat kuis dalam classroom tertentu
quizRoute.post(
  "/:classroomId",
  classroomAccess,
  validateQuizSchema,
  createPrivateQuiz
);
// Membuat kuis publik
quizRoute.post("/", validateQuizSchema, createPublicQuiz);

// Get data kuis (public)
quizRoute.get("/public", findAllQuizPublic);

// Get all kuis
quizRoute.get("/", findAll);
quizRoute.get("/:id", findOne);

// update & delete quiz private
quizRoute.put(
  "/:classroomId/:quizId",
  classroomAccess,
  validateUpdateQuizSchema,
  update
);
quizRoute.delete("/:classroomId/:quizId", classroomAccess, destroy);

// update & delete quiz public
quizRoute.put("/:quizId", validateUpdateQuizSchema, updatePublicQuiz);
quizRoute.delete("/:quizId", destroyPublicQuiz);

quizRoute.get("/usr/:classroomId", classroomAccess, getQuizByUserId);

export default quizRoute;
