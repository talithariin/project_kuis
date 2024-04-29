import sql from "./connection.js";

const tableName = "Classrooms";

const Classroom = function (room) {
  this.name = room.name;
  this.join_code = room.join_code;
  this.owner_id = room.owner_id;
  this.student_id = room.student_id;
};

Classroom.create = (newClass, result) => {
  sql.query(`INSERT INTO ${tableName} SET ?`, newClass, (err, res) => {
    if (err) {
      console.log("Error while querying:", err);
      result(err, null);
    } else {
      console.log("Data is successfully entered", res);
      result(null, { id: res.insertId, ...newClass });
    }
  });
};

Classroom.getAll = (result) => {
  sql.query(`SELECT * FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("Error while getting classrooms:", err);
      result(err, null);
      return;
    }
    console.log("Classrooms data:", res);
    result(null, res);
  });
};

Classroom.findById = (id, result) => {
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

Classroom.findByUserId = (user_id, result) => {
  sql.query(
    `SELECT * FROM ${tableName} WHERE owner_id = ${user_id} OR JSON_CONTAINS(student_id, CAST(${user_id} AS JSON))`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Classroom.update = (id, data, result) => {
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

Classroom.delete = (id, result) => {
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

Classroom.join = (join_code, userId, result) => {
  // memeriksa apakah user_id adalah owner_id
  sql.query(
    `SELECT owner_id FROM ${tableName} WHERE join_code = ?`,
    join_code,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length === 0) {
        result({ success: false, message: "Invalid_Join_Code" }, null);
        return;
      }
      const ownerId = res[0].owner_id;

      if (ownerId === userId) {
        result({ success: false, message: "Owner_Cannot_Join" }, null);
        return;
      }
      sql.query(
        `SELECT student_id FROM ${tableName} WHERE join_code = ?`,
        join_code,
        (err, res) => {
          if (err) {
            result(err, null);
            return;
          }
          // jika tidak ada kelas dengan join_code yang diminta
          if (res.length === 0) {
            console.log("Class not found for join_code:", join_code);
            result({ success: false, message: "Invalid_Join_Code" }, null);
            return;
          }
          console.log("Results of class search:", res);
          // mengambil hasil pertama dari res yang join_code nya sesuai
          const classroom = res[0];
          let studentIds = [];
          try {
            studentIds = JSON.parse(classroom.student_id);
          } catch (error) {
            console.log("Error while parsing student_id:", error);
            result(
              { success: false, message: "Invalid_Format_StudentID" },
              null
            );
            return;
          }

          // cek apakah student_id sudah ada
          if (studentIds.includes(userId)) {
            console.log("User has joined this class:", userId);
            result(
              { success: false, message: "User_Already_Joined_Classroom" },
              null
            );
            return;
          }

          studentIds.push(userId);
          sql.query(
            `UPDATE ${tableName} SET student_id = ? WHERE join_code = ?`,
            [JSON.stringify(studentIds), join_code],
            (err, res) => {
              if (err) {
                result(err, null);
                return;
              }

              if (res.affectedRows === 0) {
                result({ success: false, message: "not_found" }, null);
                return;
              }
              console.log("User successfully joined the class");
              result(null, { join_code: join_code, student_id: studentIds });
            }
          );
        }
      );
    }
  );
};

export default Classroom;
