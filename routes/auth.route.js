import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  validateLoginSchema,
  validateRegisterSchema,
} from "../middlewares/validators.js";

const authRoute = Router();

authRoute.post("/register", validateRegisterSchema, register);
authRoute.post("/login", validateLoginSchema, login);

export default authRoute;
