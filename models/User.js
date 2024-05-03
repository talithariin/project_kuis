import sql from "./connection.js";

const User = function (user) {
  this.username = user.username;
  this.email = user.email;
  this.password = user.password;
  this.full_name = user.full_name;
  this.address = user.address;
  this.birthdate = user.birthdate;
};

const tableName = "Users";
User.create = async (newUser) => {
  try {
    const { username, email, password, full_name, address, birthdate } =
      newUser;
    const [result] = await sql.execute(
      `INSERT INTO ${tableName} (username, email, password, full_name, address, birthdate) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, password, full_name, address, birthdate]
    );
    console.log("Data is successfully entered", result);
    return { id: result.insertId, ...newUser };
  } catch (error) {
    console.log("Error while querying:", error);
    throw error;
  }
};

User.getAll = async () => {
  try {
    const [rows] = await sql.execute(
      `SELECT id, username, email, role, full_name, address, birthdate FROM ${tableName}`
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

User.findById = async (id) => {
  try {
    const [rows] = await sql.execute(
      `SELECT id, username, email, full_name, address, birthdate FROM ${tableName} WHERE id = ?`,
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

User.update = async (id, data) => {
  try {
    let updateQuery = "UPDATE " + tableName + " SET ";
    let queryParams = [];
    let updateFields = [];

    for (let key in data) {
      if (data.hasOwnProperty(key) && key !== "id") {
        updateFields.push(`${key} = ?`);
        queryParams.push(data[key]);
      }
    }

    updateQuery += updateFields.join(", ");
    updateQuery += " WHERE id = ?";
    queryParams.push(id);

    const [res] = await sql.execute(updateQuery, queryParams);

    if (res.affectedRows == 0) {
      throw { type: "not_found" };
    }

    return { id: id, data };
  } catch (error) {
    throw error;
  }
};

User.delete = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ type: "not_found" }, null);
      return;
    }
    result(null, { message: "User deleted successfully" });
  });
};

User.findByUsername = async (username) => {
  try {
    const [rows] = await sql.execute(
      `SELECT * FROM ${tableName} WHERE username = ?`,
      [username]
    );
    if (rows.length) {
      return rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export default User;
