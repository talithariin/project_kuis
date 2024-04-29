import sql from "./connection.js";

const Result = function (result) {
  this.user_id = result.user_id;
  this.quiz_id = result.quiz_id;
  this.classroom_id = result.classroom_id;
  this.score = result.score;
};

const tableName = "Result";

Result.postResult = (newResult, result) => {
  const { user_id, quiz_id, score, classroom_id } = newResult;
  const values = [user_id, quiz_id, score, classroom_id];
  const query = classroom_id
    ? `INSERT INTO ${tableName} (user_id, quiz_id, score, classroom_id) VALUES (?, ?, ?, ?)`
    : `INSERT INTO ${tableName} (user_id, quiz_id, score) VALUES (?, ?, ?)`;

  sql.query(query, values, (err, res) => {
    if (err) {
      console.log("Error saat melakukan query:", err);
      result(err, null);
    } else {
      console.log("Data berhasil dimasukkan:", res);
      result(null, { id: res.insertId, ...newResult });
    }
  });
};

Result.getRank = (data, result) => {
  const { classroomId, quizId } = data;
  const values = classroomId ? [classroomId, quizId] : [quizId];

  const query = classroomId
    ? `SELECT * FROM ${tableName} WHERE classroom_id = ? AND quiz_id = ? ORDER BY score DESC`
    : `SELECT * FROM ${tableName} WHERE quiz_id = ? ORDER BY score DESC`;

  sql.query(query, values, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res);
    } else {
      result({ type: "not_found" }, null);
    }
  });
};

export default Result;
