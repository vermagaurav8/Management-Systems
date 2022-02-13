const mysql = require("mysql");

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// view all users
exports.view = (req, res) => {
  // Connect to DB
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID" + connection.threadId);

    // user the connection
    connection.query(
      "SELECT * FROM user where status = ?",
      ["active"],
      (err, rows) => {
        // when done with the connection, release the connection
        connection.release();

        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// User Search
exports.search = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID" + connection.threadId);

    let searchTerm = req.body.search;
    console.log(searchTerm);

    // user the connection
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        // when done with the connection, release the connection
        connection.release();

        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Adds Users to DB
exports.createUser = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID" + connection.threadId);
    connection.query(
      "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?",
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        // when done with the connection, release the connection
        connection.release();

        if (!err) {
          res.render("addUser", { alert: "User added successfully." });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Add User Form
exports.userForm = (req, res) => {
  res.render("addUser");
};

// Update User
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID" + connection.threadId);

    // user the connection
    connection.query(
      "UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        // when done with the connection, release the connection
        connection.release();

        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err; // Not Connected
            console.log("Connected as ID" + connection.threadId);

            connection.query(
              "SELECT * FROM user WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                // when done with the connection, release the connection
                connection.release();

                if (!err) {
                  res.render("editUser", {
                    rows,
                    alert: `${first_name} has been updated`,
                  });
                } else {
                  console.log(err);
                }

                console.log("The data from user table: \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Edit User
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID" + connection.threadId);

    // user the connection
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // when done with the connection, release the connection
        connection.release();

        if (!err) {
          res.render("editUser", { rows });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// Deleting the user
exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID" + connection.threadId);

    // user the connection
    connection.query(
      //   "DELETE FROM user WHERE id = ?", to permanantly delete a record
      "UPDATE user SET status = ? WHERE id = ?", // Not deleting, just hiding from user
      ["removed", req.params.id],
      (err, rows) => {
        // when done with the connection, release the connection
        connection.release();

        if (!err) {
          let deletedUser = encodeURIComponent(`User successfully removed.`);
          res.redirect("/?removed=" + deletedUser);
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// View Details of a particular id
exports.viewUser = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // Not Connected
    console.log("Connected as ID" + connection.threadId);

    // user the connection
    connection.query(
      "SELECT * FROM user where id = ?",
      [req.params.id],
      (err, rows) => {
        // when done with the connection, release the connection
        connection.release();

        if (!err) {
          res.render("viewUser", { rows });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};
