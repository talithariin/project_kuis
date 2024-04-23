import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  full_name: yup.string().required("Full name is required"),
  address: yup.string().required("Address is required"),
  birthdate: yup
    .date()
    .required("Birthdate is required")
    .max(new Date(), "Birthdate cannot be in the future"),
});

export const classroomSchema = yup.object().shape({
  name: yup.string().required("Class Name required"),
});

export const validateClassroomSchema = async (req, res, next) => {
  try {
    await classroomSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
