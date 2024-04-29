import Answer from "../models/Answer.js";
import Question from "../models/Question.js";

export const create = (req, res, next) => {
  const questionId = req.params.questionId;
  const userId = req.userId;
  const userAnswer = req.body.user_answer_option;

  Question.findById(questionId, (err, questionData) => {
    if (err) {
      console.error(err);
      return next(new Error("Internal_Server_Error"));
    }
    if (!questionData) {
      return next(new Error("Question_Not_Found"));
    }

    Answer.findByQuestionAndUser(questionId, userId, (err, existingAnswer) => {
      if (err) {
        console.error(err);
        return next(new Error("Internal_Server_Error"));
      }
      if (existingAnswer) {
        return next(new Error("Answer_Already_Exist"));
      }

      const isCorrect = userAnswer === questionData.answer_key;

      const newAnswer = new Answer({
        user_answer_option: userAnswer,
        user_id: userId,
        question_id: questionId,
        is_correct: isCorrect,
      });

      Answer.create(newAnswer, (err, data) => {
        if (err) {
          console.error(err);
          return next(new Error("Internal_Server_Error"));
        }
        res.send(data);
      });
    });
  });
};

export const update = (req, res, next) => {
  const questionId = req.params.questionId;
  const { user_answer_option } = req.body;
  const userId = req.userId;
  let isCorrect = false;

  Answer.findByQuestionAndUser(questionId, userId, (err, existingAnswer) => {
    if (err) {
      console.error(err);
      return next(new Error("Internal_Server_Error"));
    }
    if (!existingAnswer) {
      return res.status(404).send({
        message: `Not found answer for question id : ${questionId}`,
      });
    }

    Question.findById(questionId, (err, questionData) => {
      if (err) {
        console.error(err);
        return next(new Error("Internal_Server_Error"));
      }
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

      Answer.update(
        existingAnswer.id,
        { user_answer_option, is_correct: isCorrect },
        (err, data) => {
          if (err) {
            if (err.type === "not_found") {
              res.status(404).send({
                message: `Not found answer for question with id : ${questionId}`,
              });
            } else {
              return next(new Error("Internal_Server_Error"));
            }
          } else {
            res.send(data);
          }
        },
        userId,
        questionId
      );
    });
  });
};
