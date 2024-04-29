import { Router } from "express";
import {
  create,
  destroy,
  findAll,
  findByUserId,
  findOne,
  join,
  update,
} from "../controllers/classroom.controller.js";
import { validateClassroomSchema } from "../middlewares/validators.js";
import classroomAccess from "../middlewares/classroomAccess.js";

const classroomRoute = Router();

classroomRoute.post("/", validateClassroomSchema, create);
classroomRoute.get("/", findAll);
classroomRoute.put(
  "/:classroomId",
  classroomAccess,
  validateClassroomSchema,
  update
);
classroomRoute.delete("/:classroomId", classroomAccess, destroy);
classroomRoute.post("/join", join);
classroomRoute.get("/:id", findOne);
classroomRoute.get("/usr/:classroomId", classroomAccess, findByUserId);

export default classroomRoute;
