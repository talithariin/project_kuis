// routes/classroom.route.js
import { Router } from "express";
import { create, findAll } from "../controllers/classroom.controller.js";
import { validateClassroomSchema } from "../middlewares/validators.js";

const classroomRoute = Router();

classroomRoute.post("/", validateClassroomSchema, create);
classroomRoute.get("/", findAll);

export default classroomRoute;
