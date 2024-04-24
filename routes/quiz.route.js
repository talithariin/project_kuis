import { Router } from "express";
import {
  create,
  destroy,
  findAll,
  findOne,
  update,
} from "../controllers/quiz.controller.js";
import {
  validateQuizSchema,
  validateUpdateQuizSchema,
} from "../middlewares/validators.js";

const quizRoute = Router();

quizRoute.post("/", validateQuizSchema, create);
quizRoute.get("/", findAll);
quizRoute.get("/:id", findOne);
quizRoute.put("/:id", validateUpdateQuizSchema, update);
quizRoute.delete("/:id", destroy);

export default quizRoute;
