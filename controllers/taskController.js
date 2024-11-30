const db = require('../models/db');

// Get all tasks for a specific user
const getAllTasks = (req, res) => {
  const userId = req.user.userId;
  db.all('SELECT * FROM tasks WHERE userId = ?', [userId], (err, tasks) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error fetching tasks', error: err });
    }
    res.status(200).json({ success: true, tasks });
  });
};

// Create a new task
const createTask = (req, res) => {
  const { title, description, dueDate, priority } = req.body;
  const userId = req.user.userId;

  // Log the request body for debugging
  console.log("Incoming Task Data:", req.body);

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  const task = {
    title,
    description,
    dueDate: dueDate || null,
    priority: priority || "Low",
    status: "Pending",
    userId,
  };

  const query =
    "INSERT INTO tasks (title, description, dueDate, priority, status, userId) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [
    task.title,
    task.description,
    task.dueDate,
    task.priority,
    task.status,
    task.userId,
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error("Database Error:", err.message); // Log error
      return res.status(500).json({
        success: false,
        message: "Error creating task",
        error: err.message,
      });
    }
    task.id = this.lastID;
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  });
};


// Update an existing task
const updateTask = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  values.push(id);

  const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
  db.run(query, values, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error updating task', error: err });
    }
    res.status(200).json({ success: true, message: 'Task updated successfully' });
  });
};

// Delete a task
const deleteTask = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error deleting task', error: err });
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully', id });
  });
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
