import { Router } from "express";
import { postResult, getRank } from "../controllers/result.controller.js";
import classroomAccess from "../middlewares/classroomAccess.js";
const resultRoute = Router();

resultRoute.post("/public/:quizId", postResult);
resultRoute.post("/private/:classroomId/:quizId", classroomAccess, postResult);
resultRoute.get("/rank/:classroomId/:quizId", classroomAccess, getRank);
resultRoute.get("/rank/:quizId", getRank);

export default resultRoute;
