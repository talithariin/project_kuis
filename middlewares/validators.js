import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required("'username' is required"),
  password: yup.string().required("'password' is required"),
});

export const validateLoginSchema = async (req, res, next) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const registerSchema = yup.object().shape({
  username: yup.string().required("'username' is required"),
  email: yup.string().email("Invalid email").required("'email' is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("'password' is required"),
  full_name: yup.string().required("'full_name' is required"),
  address: yup.string().required("'address' is required"),
  birthdate: yup
    .date()
    .required("'birthdate' is required")
    .max(new Date(), "Birthdate cannot be in the future"),
});

export const validateRegisterSchema = async (req, res, next) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const classroomSchema = yup.object().shape({
  name: yup.string().required("'name' required"),
});

export const validateClassroomSchema = async (req, res, next) => {
  try {
    await classroomSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const quizSchema = yup.object().shape({
  name: yup.string().required("'name' required"),
  is_public: yup.boolean().required("'is_public' required"),
});

export const validateQuizSchema = async (req, res, next) => {
  try {
    await quizSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const updateQuizSchema = yup.object().shape({
  name: yup.string().required("'name' required"),
});

export const validateUpdateQuizSchema = async (req, res, next) => {
  try {
    await updateQuizSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const questionSchema = yup.object().shape({
  question_text: yup.string().required("'question_text' is required"),
  options: yup.object().shape({
    a: yup.string().required("Option 'a' is required"),
    b: yup.string().required("Option 'b' is required"),
    c: yup.string().required("Option 'c' is required"),
    d: yup.string().required("Option 'd' is required"),
    e: yup.string().required("Option 'e' is required"),
  }),
});

export const validateQuestionSchema = async (req, res, next) => {
  try {
    await questionSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export const answerSchema = yup.object().shape({
  user_answer_option: yup.string().oneOf(["a", "b", "c", "d", "e"]).required(),
});

export const validateAnswerSchema = async (req, res, next) => {
  try {
    await answerSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
