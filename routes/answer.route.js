import { Router } from "express";
import { create, update } from "../controllers/answer.controller.js";
import classroomAccess from "../middlewares/classroomAccess.js";
import { validateAnswerSchema } from "../middlewares/validators.js";

const answerRoute = Router();

answerRoute.post(
  "/:classroomId/:questionId",
  validateAnswerSchema,
  classroomAccess,
  create
);
answerRoute.put(
  "/:classroomId/:questionId",
  validateAnswerSchema,
  classroomAccess,
  update
);

export default answerRoute;
