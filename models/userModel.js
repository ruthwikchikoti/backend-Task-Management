const db = require('./db');

const createUser = (username, password, callback) => {
  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    callback
  );
};

const findUserByUsername = (username, callback) => {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.error("Error querying database:", err.message);
    }
    callback(err, user);
  });
};

module.exports = {
  createUser,
  findUserByUsername,
};
