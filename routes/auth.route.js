import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../middlewares/validators.js";

const authRoute = Router();

authRoute.post(
  "/register",
  async (req, res, next) => {
    try {
      await registerSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
  },
  register
);

authRoute.post(
  "/login",
  async (req, res, next) => {
    try {
      await loginSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (error) {
      res.status(400).json({ errors: error.errors });
    }
  },
  login
);

export default authRoute;
