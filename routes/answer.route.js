import { Router } from "express";
import { create, update } from "../controllers/answer.controller.js";
import classroomAccess from "../middlewares/classroomAccess.js";

const answerRoute = Router();

answerRoute.post("/:classroomId/:questionId", classroomAccess, create);
answerRoute.put("/:classroomId/:questionId", classroomAccess, update);

export default answerRoute;
