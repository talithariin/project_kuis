import { Router } from "express";
import {
  create,
  destroy,
  findAll,
  findOne,
  update,
} from "../controllers/question.controller.js";
import {
  validateQuestionSchema,
  validateUpdateQuestionSchema,
} from "../middlewares/validators.js";

const questionRoute = Router();

questionRoute.post("/", validateQuestionSchema, create);
questionRoute.get("/", findAll);
questionRoute.get("/:id", findOne);
questionRoute.put("/:id", validateUpdateQuestionSchema, update);
questionRoute.delete("/:id", destroy);

export default questionRoute;
