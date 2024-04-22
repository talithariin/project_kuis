import { Router } from "express";
import { create } from "../controllers/classroom.controller.js";
import { classroomSchema } from "../middlewares/validators.js";

const classroomRoute = Router();

classroomRoute.post(
  "/",
  async (req, res, next) => {
    try {
      await classroomSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
  },
  create
);

export default classroomRoute;
