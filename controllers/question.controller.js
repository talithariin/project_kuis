import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";

export const create = (req, res) => {
  const newQuestion = new Question({
    question_text: req.body.question_text,
    options: req.body.options,
    answer_key: req.body.answer_key,
    quiz_id: req.body.quiz_id,
  });

  Question.create(newQuestion, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Exist some error" });
    }
    res.send(data);
  });
};

export const findAll = async (req, res, next) => {
  Question.getAll(async (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Exist some error" });
    }
    try {
      const quizzes = await Promise.all(
        data.map((question) => {
          return new Promise((resolve, reject) => {
            Quiz.findById(question.quiz_id, (err, quiz) => {
              if (err) {
                reject(err);
              } else {
                resolve(quiz);
              }
            });
          });
        })
      );

      const mergedData = data.map((question, index) => {
        const options = JSON.parse(question.options);
        return {
          ...question,
          options: options,
          quiz: quizzes[index],
        };
      });

      res.send(mergedData);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ msg: "Exist some error" });
    }
  });
};

export const findOne = (req, res) => {
  Question.findById(req.params.id, async (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found question with id : ${req.params.id}`,
        });
      } else {
        res.status(500).send({ msg: "Exist some error" });
      }
    } else {
      try {
        const options = JSON.parse(data.options);

        const quiz = await new Promise((resolve, reject) => {
          Quiz.findById(data.quiz_id, (err, quiz) => {
            if (err) {
              reject(err);
            } else {
              resolve(quiz);
            }
          });
        });

        const mergedData = {
          ...data,
          options: options,
          quiz: quiz,
        };

        res.send(mergedData);
      } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Exist some error" });
      }
    }
  });
};

export const update = (req, res) => {
  const questionData = new Question(req.body);
  Question.update(req.params.id, questionData, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found student with id : ${req.params.id}`,
        });
      } else {
        console.log(err);
        res.status(500).send({ msg: "Exist some error" });
      }
    } else {
      res.send(data);
    }
  });
};

export const destroy = (req, res) => {
  Question.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.type === "not_found") {
        res.status(404).send({
          message: `Not found question with id : ${req.params.id}`,
        });
      } else {
        res.status(500).send({ msg: "Exist some error" });
      }
    } else {
      res.send({ msg: "Success delete question" });
    }
  });
};
