import Answer from "../models/Answer.js";
import Question from "../models/Question.js";

export const create = async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const userId = req.userId;
    const userAnswer = req.body.user_answer_option;

    const questionData = await Question.findById(questionId);
    if (!questionData) {
      return next(new Error("Question_Not_Found"));
    }

    // Check if the user has already answered this question
    const existingAnswer = await Answer.findByQuestionAndUser(
      questionId,
      userId
    );
    if (existingAnswer) {
      return res.status(400).send({
        message:
          "You have already answered this question. Please update if you want to change your answer.",
      });
    }

    const isCorrect = userAnswer === questionData.answer_key;

    const newAnswer = {
      user_answer_option: userAnswer,
      user_id: userId,
      question_id: questionId,
      is_correct: isCorrect,
    };

    const data = await Answer.create(newAnswer);
    res.send(data);
  } catch (error) {
    console.error(error);
    return next(new Error("Internal_Server_Error"));
  }
};

export const update = async (req, res, next) => {
  const questionId = req.params.questionId;
  const { user_answer_option } = req.body;
  const userId = req.userId;
  let isCorrect = false;

  try {
    const existingAnswer = await Answer.findByQuestionAndUser(
      questionId,
      userId
    );

    if (!existingAnswer) {
      return res.status(404).send({
        message: `Not found answer for question id : ${questionId}`,
      });
    }

    const questionData = await Question.findById(questionId);
    if (
      !questionData ||
      (Array.isArray(questionData) && questionData.length === 0)
    ) {
      return res.status(404).send({
        message: `Not found question with id : ${questionId}`,
      });
    }

    const question = Array.isArray(questionData)
      ? questionData[0]
      : questionData;

    if (user_answer_option === question.answer_key) {
      isCorrect = true;
    }

    const data = await Answer.update(
      existingAnswer.id,
      { user_answer_option, is_correct: isCorrect },
      userId,
      questionId
    );

    if (data.type === "not_found") {
      return res.status(404).send({
        message: `Not found answer for question with id : ${questionId}`,
      });
    }

    res.send(data);
  } catch (error) {
    console.error(error);
    return next(new Error("Internal_Server_Error"));
  }
};
