import { Router } from "express";
import {
  destroy,
  findAll,
  findOne,
  update,
} from "../controllers/profile.controller.js";
const profileRoute = Router();

profileRoute.put("/:id", update);
profileRoute.delete("/:id", destroy);
profileRoute.get("/", findAll);
profileRoute.get("/:id", findOne);

export default profileRoute;
