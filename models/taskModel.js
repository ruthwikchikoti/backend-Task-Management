const db = require('./db');

const getAllTasks = (userId, callback) => {
  db.all('SELECT * FROM tasks WHERE userId = ?', [userId], callback);
};

const createTask = (task, callback) => {
  const { title, description, dueDate, priority, status, userId } = task;
  db.run(
    'INSERT INTO tasks (title, description, dueDate, priority, status, userId) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, dueDate, priority, status, userId],
    callback
  );
};

const updateTask = (id, updates, callback) => {
  const { title, description, dueDate, priority, status } = updates;
  db.run(
    'UPDATE tasks SET title = ?, description = ?, dueDate = ?, priority = ?, status = ? WHERE id = ?',
    [title, description, dueDate, priority, status, id],
    callback
  );
};

const deleteTask = (id, callback) => {
  db.run('DELETE FROM tasks WHERE id = ?', [id], callback);
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
