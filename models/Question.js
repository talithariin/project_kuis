import sql from "./connection.js";

const Question = function (question) {
  this.question_text = question.question_text;
  this.options = question.options;
  this.answer_key = question.answer_key;
  this.quiz_id = question.quiz_id;
};

const tableName = "Questions";

Question.create = (newQuestion, result) => {
  const { question_text, options, answer_key, quiz_id } = newQuestion;
  const values = [question_text, JSON.stringify(options), answer_key, quiz_id];
  sql.query(
    `INSERT INTO ${tableName} (question_text, options, answer_key, quiz_id) VALUES (?, ?, ?, ?)`,
    values,
    (err, res) => {
      if (err) {
        console.log("Error saat melakukan query:", err);
        result(err, null);
      } else {
        console.log("Data berhasil dimasukkan:", res);
        result(null, { id: res.insertId, ...newQuestion });
      }
    }
  );
};

Question.getAll = (result) => {
  sql.query(`SELECT * FROM ${tableName}`, (err, res) => {
    if (err) result(err, null);
    result(null, res);
  });
};

Question.findById = (id, result) => {
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

Question.update = (id, data, result) => {
  const optionsJSON = JSON.stringify(data.options);
  sql.query(
    `UPDATE ${tableName} SET question_text = ?, options = ?, answer_key= ? WHERE id = ?`,
    [data.question_text, optionsJSON, data.answer_key, id],
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

Question.delete = (id, result) => {
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
export default Question;
