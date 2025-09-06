const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

router.get('/:projectId', auth, async (req, res) => {
  try {
    const tasks = await db.query('SELECT * FROM tasks WHERE project_id = $1', [req.params.projectId]);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { projectId, title, description, assignee_id, due_date } = req.body;

  try {
    const newTask = await db.query(
      'INSERT INTO tasks (project_id, title, description, assignee_id, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [projectId, title, description, assignee_id, due_date]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  try {
    const updatedTask = await db.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
