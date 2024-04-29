import sql from "./connection.js";

const Quiz = function (quiz) {
  this.name = quiz.name;
  this.is_public = quiz.is_public;
  this.classroom_id = quiz.is_public ? null : quiz.classroom_id;
};

const tableName = "Quizzez";

Quiz.create = (newQuiz, result) => {
  const { name, is_public, classroom_id } = newQuiz;
  console.log("Data yang akan dimasukkan:", name, is_public, classroom_id);
  const values = [name, is_public, classroom_id];
  sql.query(
    `INSERT INTO ${tableName} (name, is_public, classroom_id) VALUES (?, ?, ?)`,
    values,
    (err, res) => {
      if (err) {
        console.log("Error saat melakukan query:", err);
        result(err, null);
      } else {
        console.log("Data berhasil dimasukkan:", res);
        result(null, { id: res.insertId, ...newQuiz });
      }
    }
  );
};

Quiz.getAll = (result) => {
  sql.query(`SELECT * FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("Error while getting quiz:", err);
      result(err, null);
      return;
    }
    console.log("Quiz data:", res);
    result(null, res);
  });
};

Quiz.getAllPublicQuiz = (result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE is_public = 1`, (err, res) => {
    if (err) {
      console.log("Error while getting public quizzes:", err);
      result(err, null);
      return;
    }
    console.log("Public Quiz data:", res);
    result(null, res);
  });
};

Quiz.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ type: "not_found" }, null);
  });
};

Quiz.findByUserId = (user_id, result) => {
  sql.query(
    `SELECT * FROM ${tableName} WHERE classroom_id IN (SELECT id FROM Classrooms WHERE owner_id = ${user_id} OR JSON_CONTAINS(student_id, CAST(${user_id} AS JSON)))`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Quiz.update = (id, data, result) => {
  sql.query(
    `UPDATE ${tableName} SET name = ? WHERE id = ?`,
    [data.name, id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        result({ type: "not_found" }, null);
        return;
      }

      result(null, { id: id, data });
    }
  );
};

Quiz.delete = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ type: "not_found" }, null);
      return;
    }
    result(null, res);
  });
};

Quiz.findAllQuestionId = (quizId, result) => {
  sql.query(
    `SELECT id FROM ${tableName} WHERE quiz_id = ?`,
    [quizId],
    (err, res) => {
      if (err) {
        console.error("Error while executing SQL query:", err);
        result(err, null);
        return;
      }
      const questionIds = res.map((question) => question.id);
      result(null, questionIds);
    }
  );
};

export default Quiz;
