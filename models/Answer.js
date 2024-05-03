import sql from "./connection.js";

const Answer = function (answer) {
  this.user_answer_option = answer.user_answer_option;
  this.user_id = answer.user_id;
  this.question_id = answer.question_id;
  this.is_correct = answer.is_correct;
};

const tableName = "Answers";

Answer.create = async (newAnswer) => {
  try {
    const { user_answer_option, user_id, question_id, is_correct } = newAnswer;
    const values = [user_answer_option, user_id, question_id, is_correct];
    const [result] = await sql.execute(
      `INSERT INTO ${tableName} (user_answer_option, user_id, question_id, is_correct) VALUES (?, ?, ?, ?)`,
      values
    );
    return { id: result.insertId, ...newAnswer };
  } catch (error) {
    console.error("Error saat melakukan query:", error);
    throw error;
  }
};

Answer.update = async (id, data, userId, questionId) => {
  const { user_answer_option, is_correct } = data;
  try {
    const [result] = await sql.execute(
      `UPDATE ${tableName} SET user_answer_option = ?, is_correct = ? WHERE user_id = ? AND question_id = ?`,
      [user_answer_option, is_correct, userId, questionId]
    );

    if (result.affectedRows === 0) {
      return { type: "not_found" };
    }

    return { id, ...data };
  } catch (error) {
    console.error("Error while executing SQL query:", error);
    throw error;
  }
};

Answer.findByQuestionAndUser = async (questionId, userId) => {
  try {
    const [rows] = await sql.execute(
      `SELECT * FROM ${tableName} WHERE question_id = ? AND user_id = ?`,
      [questionId, userId]
    );
    if (rows.length) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error("Error while executing SQL query:", error);
    throw error;
  }
};

Answer.findByQuizAndUser = async (quizId, userId) => {
  try {
    const [rows] = await sql.execute(
      `SELECT * FROM ${tableName} WHERE quiz_id = ? AND user_id = ?`,
      [quizId, userId]
    );
    return rows;
  } catch (error) {
    console.error("Error while executing SQL query:", error);
    throw error;
  }
};

Answer.getUserTrueCount = async (userId, questionIds) => {
  try {
    const [rows] = await sql.execute(
      `SELECT COUNT(*) AS true_count FROM ${tableName} WHERE user_id = ? AND question_id IN (?) AND is_correct = 1`,
      [userId, questionIds]
    );
    return rows[0].true_count;
  } catch (error) {
    console.error("Error while executing SQL query:", error);
    throw error;
  }
};

export default Answer;
