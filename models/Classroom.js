import sql from "./connection.js";

const tableName = "Classrooms";

const Classroom = function (room) {
  this.name = room.name;
  this.join_code = room.join_code;
  this.owner_id = room.owner_id;
  this.student_id = room.student_id;
};

Classroom.create = async (newClassroom) => {
  try {
    const { name, join_code, owner_id } = newClassroom;
    const [result] = await sql.execute(
      `INSERT INTO ${tableName} (name, join_code, owner_id) VALUES (?, ?, ?)`,
      [name, join_code, owner_id]
    );
    console.log("Data is successfully entered", result);
    return { id: result.insertId, ...newClassroom };
  } catch (error) {
    console.log("Error while querying:", error);
    throw error;
  }
};

Classroom.getAll = async () => {
  try {
    const [rows] = await sql.execute(`SELECT * FROM ${tableName}`);
    return rows;
  } catch (error) {
    console.log("Error while getting classrooms:", error);
    throw error;
  }
};

Classroom.findById = async (id) => {
  try {
    const [rows] = await sql.execute(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [id]
    );
    if (rows.length) {
      return rows[0];
    } else {
      throw { type: "not_found" };
    }
  } catch (error) {
    throw error;
  }
};

Classroom.findByUserId = async (user_id) => {
  try {
    const [rows] = await sql.execute(
      `SELECT * FROM ${tableName} WHERE owner_id = ? OR JSON_CONTAINS(student_id, CAST(? AS JSON))`,
      [user_id, user_id]
    );
    return rows;
  } catch (error) {
    console.log("Error while querying:", error);
    throw error;
  }
};

Classroom.update = async (id, data) => {
  try {
    const [result] = await sql.execute(
      `UPDATE ${tableName} SET name = ? WHERE id = ?`,
      [data.name, id]
    );
    if (result.affectedRows === 0) {
      throw { type: "not_found" };
    } else {
      return { id: id, data };
    }
  } catch (error) {
    console.log("Error while updating:", error);
    throw error;
  }
};

Classroom.delete = async (id) => {
  try {
    const [result] = await sql.execute(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      throw { type: "not_found" };
    }
    return { success: true };
  } catch (error) {
    console.log("Error while deleting:", error);
    throw error;
  }
};

Classroom.join = async (join_code, userId) => {
  try {
    const [classroomResult] = await sql.execute(
      `SELECT owner_id, student_id FROM ${tableName} WHERE join_code = ?`,
      [join_code]
    );

    if (classroomResult.length === 0) {
      return { success: false, message: "Invalid_Join_Code" };
    }

    const { owner_id, student_id } = classroomResult[0];

    if (owner_id === userId) {
      return { success: false, message: "Owner_Cannot_Join" };
    }

    let studentIds = [];
    if (student_id !== null && student_id !== undefined) {
      studentIds = student_id;
    }

    if (studentIds.includes(userId)) {
      return { success: false, message: "User_Already_Joined_Classroom" };
    }

    if (!student_id) {
      studentIds = [userId];
    } else {
      studentIds.push(userId);
    }

    const [updateResult] = await sql.execute(
      `UPDATE ${tableName} SET student_id = ? WHERE join_code = ?`,
      [JSON.stringify(studentIds), join_code]
    );

    if (updateResult.affectedRows === 0) {
      throw { type: "not_found" };
    }

    return { join_code: join_code, student_id: studentIds };
  } catch (error) {
    console.log("Error while joining classroom:", error);
    throw error;
  }
};

export default Classroom;
