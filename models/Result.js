import sql from "./connection.js";
import pool from "../models/connection.js";

const Result = function (result) {
  this.user_id = result.user_id;
  this.quiz_id = result.quiz_id;
  this.classroom_id = result.classroom_id;
  this.score = result.score;
};

const tableName = "Result";

Result.postResult = async (newResult) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { user_id, quiz_id, score, classroom_id } = newResult;
    const [result] = await connection.execute(
      `INSERT INTO ${tableName} (user_id, quiz_id, score, classroom_id) VALUES (?, ?, ?, ?)`,
      [user_id, quiz_id, score, classroom_id]
    );
    console.log("Data is successfully entered", result);
    return { id: result.insertId, ...newResult };
  } catch (err) {
    console.error("Error saat melakukan query:", err);
    throw err;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

Result.getRank = async (data) => {
  try {
    const { classroomId, quizId } = data;
    const values = classroomId ? [classroomId, quizId] : [quizId];

    const query = classroomId
      ? `SELECT * FROM ${tableName} WHERE classroom_id = ? AND quiz_id = ? ORDER BY score DESC`
      : `SELECT * FROM ${tableName} WHERE quiz_id = ? ORDER BY score DESC`;

    // Eksekusi query menggunakan sql.execute
    const [rows] = await sql.execute(query, values);
    if (rows.length) {
      return rows;
    } else {
      throw { type: "not_found" };
    }
  } catch (err) {
    console.error("Error saat melakukan query:", err);
    throw err;
  }
};

export default Result;
