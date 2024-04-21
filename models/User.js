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

User.create = (newUser, result) => {
  sql.query(`INSERT INTO ${tableName} SET ?`, newUser, (err, res) => {
    if (err) {
      console.log("Error while querying:", err);
      result(err, null);
    } else {
      console.log("Data is successfully entered", res);
      result(null, { id: res.insertId, ...newUser });
    }
  });
};

User.getAll = (result) => {
  sql.query(
    `SELECT id, username, email, full_name, address, birthdate FROM ${tableName}`,
    (err, res) => {
      if (err) result(err, null);
      result(null, res);
    }
  );
};

User.findById = (id, result) => {
  sql.query(
    `SELECT id, username, email, full_name, address, birthdate FROM ${tableName} WHERE id = ${id}`,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      // jika data ditemukan
      if (res.length) {
        result(null, res[0]);
        return;
      }
      // jika kosong
      result({ type: "not_found" }, null);
    }
  );
};

User.update = (id, data, result) => {
  let updateQuery = "UPDATE ?? SET ";
  let queryParams = [tableName];
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

  sql.query(updateQuery, queryParams, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ type: "not_found" }, null);
      return;
    }

    result(null, { id: id, data });
  });
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

User.findByUsername = (username, result) => {
  sql.query(
    `SELECT * FROM ${tableName} WHERE username = ?`,
    [username], // Perubahan disini, username dikirim sebagai array
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ type: "not_found" }, null);
    }
  );
};

export default User;
