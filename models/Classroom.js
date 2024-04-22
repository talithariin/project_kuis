import sql from "./connection.js";

const tableName = "Classrooms";

const Classroom = function (room) {
  this.name = room.name;
  this.join_code = room.join_code;
  this.owner_id = room.owner_id;
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
    if (err) result(err, null);
    result(null, res);
  });
};

export default Classroom;
