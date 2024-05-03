import sql from "./connection.js";

const Question = function (question) {
  this.question_text = question.question_text;
  this.options = question.options;
  this.answer_key = question.answer_key;
  this.quiz_id = question.quiz_id;
};

const tableName = "Questions";

Question.create = async (newQuestion) => {
  try {
    const { question_text, options, answer_key, quiz_id } = newQuestion;
    const values = [
      question_text,
      JSON.stringify(options),
      answer_key,
      quiz_id,
    ];
    const [res] = await sql.execute(
      `INSERT INTO ${tableName} (question_text, options, answer_key, quiz_id) VALUES (?, ?, ?, ?)`,
      values
    );

    console.log("Data berhasil dimasukkan:", res);
    return { id: res.insertId, ...newQuestion };
  } catch (error) {
    console.log("Error saat melakukan query:", error);
    throw error;
  }
};

Question.getAll = async (result) => {
  try {
    const [rows] = await sql.execute(`SELECT * FROM ${tableName}`);
    return rows;
  } catch (error) {
    throw error;
  }
};

Question.getAllByQuizId = async (quizId, result) => {
  try {
    const [rows] = await sql.execute(
      `SELECT id, question_text, quiz_id, options FROM ${tableName} WHERE quiz_id = ?`,
      [quizId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

Question.findById = async (id) => {
  try {
    const [rows] = await sql.execute(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );
    if (rows.length) {
      return rows;
    } else {
      throw { type: "not_found" };
    }
  } catch (error) {
    throw error;
  }
};

Question.update = async (id, data) => {
  try {
    const optionsJSON = JSON.stringify(data.options);
    const [res] = await sql.execute(
      `UPDATE ${tableName} SET question_text = ?, options = ?, answer_key= ? WHERE id = ?`,
      [data.question_text, optionsJSON, data.answer_key, id]
    );

    if (res.affectedRows === 0) {
      throw { type: "not_found" };
    }

    return { id: id, data };
  } catch (error) {
    throw error;
  }
};

Question.delete = async (id) => {
  try {
    const [res] = await sql.execute(`DELETE FROM ${tableName} WHERE id = ?`, [
      id,
    ]);

    if (res.affectedRows === 0) {
      throw { type: "not_found" };
    }

    return { msg: "Success delete question" };
  } catch (error) {
    throw error;
  }
};

Question.findByQuizAndUser = async (quizId, userId) => {
  try {
    const [rows] = await sql.execute(
      `SELECT q.id, q.question_text, q.options, q.answer_key 
       FROM ${tableName} q
       INNER JOIN Quizzes qz ON q.quiz_id = qz.id
       INNER JOIN Classrooms c ON qz.classroom_id = c.id
       WHERE (JSON_CONTAINS(c.student_id, CAST(? AS JSON), '$') = 1 OR c.owner_id = ?) AND q.quiz_id = ?`,
      [userId, userId, quizId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

Question.findAllQuestionId = async (quizId) => {
  try {
    const [res] = await sql.execute(
      `SELECT id FROM ${tableName} WHERE quiz_id = ?`,
      [quizId]
    );

    if (res.length === 0) {
      throw { type: "not_found" };
    }

    const questionIds = res.map((question) => question.id);
    return questionIds;
  } catch (error) {
    throw error;
  }
};

export default Question;
