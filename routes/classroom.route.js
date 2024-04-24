import { Router } from "express";
import {
  create,
  destroy,
  findAll,
  findOne,
  join,
  update,
} from "../controllers/classroom.controller.js";
import { validateClassroomSchema } from "../middlewares/validators.js";

const classroomRoute = Router();

classroomRoute.post("/", validateClassroomSchema, create);
classroomRoute.get("/", findAll);
classroomRoute.put("/:id", validateClassroomSchema, update);
classroomRoute.delete("/:id", destroy);
classroomRoute.post("/join", join);
classroomRoute.get("/:id", findOne);

export default classroomRoute;
