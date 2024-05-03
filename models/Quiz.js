import sql from "./connection.js";

const Quiz = function (quiz) {
  this.name = quiz.name;
  this.is_public = quiz.is_public;
  this.classroom_id = quiz.is_public ? null : quiz.classroom_id;
};

const tableName = "Quizzez";

Quiz.create = async (newQuiz) => {
  try {
    const { name, is_public, classroom_id } = newQuiz;
    const values = [name, is_public, classroom_id];
    const [res] = await sql.execute(
      `INSERT INTO ${tableName} (name, is_public, classroom_id) VALUES (?, ?, ?)`,
      values
    );
    return { id: res.insertId, ...newQuiz };
  } catch (error) {
    console.log("Error while querying", error);
    throw error;
  }
};

Quiz.getAll = async () => {
  try {
    const [rows] = await sql.execute(`SELECT * FROM ${tableName}`);
    return rows;
  } catch (error) {
    console.log("Error while getting quiz:", error);
    throw error;
  }
};

Quiz.getAllPublicQuiz = async () => {
  try {
    const [rows] = await sql.execute(
      `SELECT * FROM ${tableName} WHERE is_public = 1`
    );
    return rows;
  } catch (error) {
    console.log("Error while getting public quizzes:", error);
    throw error;
  }
};

Quiz.findById = async (id) => {
  try {
    const [res] = await sql.execute(`SELECT * FROM ${tableName} WHERE id = ?`, [
      id,
    ]);

    if (res.length) {
      return res[0];
    } else {
      throw { type: "not_found" };
    }
  } catch (error) {
    console.log("Error while querying:", error);
    throw error;
  }
};

Quiz.findByUserId = async (user_id) => {
  try {
    const [rows] = await sql.execute(
      `
      SELECT * FROM ${tableName} 
      WHERE classroom_id IN (
        SELECT id FROM Classrooms 
        WHERE owner_id = ? 
        OR JSON_CONTAINS(student_id, CAST(? AS JSON))
      )`,
      [user_id, user_id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

Quiz.update = async (id, data) => {
  try {
    const [res] = await sql.execute(
      `UPDATE ${tableName} SET name = ? WHERE id = ?`,
      [data.name, id]
    );

    if (res.affectedRows === 0) {
      throw { type: "not_found" };
    }

    return { id: id, data };
  } catch (error) {
    throw error;
  }
};

Quiz.delete = async (id) => {
  try {
    const [res] = await sql.execute(`DELETE FROM ${tableName} WHERE id = ?`, [
      id,
    ]);

    if (res.affectedRows === 0) {
      throw { type: "not_found" };
    }

    return res;
  } catch (error) {
    throw error;
  }
};

Quiz.findAllQuestionId = async (quizId) => {
  try {
    const [rows] = await sql.execute(
      `SELECT id FROM ${tableName} WHERE quiz_id = ?`,
      [quizId]
    );

    const questionIds = rows.map((question) => question.id);
    return questionIds;
  } catch (error) {
    throw error;
  }
};

export default Quiz;
