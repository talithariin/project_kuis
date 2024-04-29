import sql from "./connection.js";

const Answer = function (answer) {
  this.user_answer_option = answer.user_answer_option;
  this.user_id = answer.user_id;
  this.question_id = answer.question_id;
  this.is_correct = answer.is_correct;
};

const tableName = "Answers";

Answer.create = (newAnswer, result) => {
  const { user_answer_option, user_id, question_id, is_correct } = newAnswer;
  const values = [user_answer_option, user_id, question_id, is_correct];

  sql.query(
    `INSERT INTO ${tableName} (user_answer_option, user_id, question_id, is_correct) VALUES (?, ?, ?, ?)`,
    values,
    (err, res) => {
      if (err) {
        console.error("Error saat melakukan query:", err);
        return result(err, null);
      } else {
        console.log("Data berhasil dimasukkan:", res);
        return result(null, { id: res.insertId, ...newAnswer });
      }
    }
  );
};

Answer.update = (id, data, result, userId, questionId) => {
  const { user_answer_option, is_correct } = data;
  sql.query(
    `UPDATE ${tableName} SET user_answer_option = ?, is_correct = ? WHERE user_id = ? AND question_id = ?`,
    [user_answer_option, is_correct, userId, questionId],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ type: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...data });
    }
  );
};

Answer.findByQuestionAndUser = (questionId, userId, result) => {
  sql.query(
    `SELECT * FROM ${tableName} WHERE question_id = ? AND user_id = ?`,
    [questionId, userId],
    (err, res) => {
      if (err) {
        console.error("Error saat melakukan query:", err);
        return result(err, null);
      }
      if (res.length) {
        return result(null, res);
      }
      return result(null, null);
    }
  );
};

Answer.findByQuizAndUser = (quizId, userId) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `SELECT * FROM ${tableName} WHERE quiz_id = ? AND user_id = ?`,
      [quizId, userId],
      (err, res) => {
        if (err) {
          console.error("Error saat melakukan query:", err);
          return reject(err);
        }
        resolve(res);
      }
    );
  });
};

Answer.getUserTrueCount = (userId, questionIds, result) => {
  sql.query(
    `SELECT COUNT(*) AS true_count FROM ${tableName} WHERE user_id = ? AND question_id IN (?) AND is_correct = 1`,
    [userId, questionIds],
    (err, res) => {
      if (err) {
        console.error("Error while executing SQL query:", err);
        return result(err, null);
      } else {
        return result(null, res[0].true_count);
      }
    }
  );
};

export default Answer;
