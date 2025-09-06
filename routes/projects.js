const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

router.get('/', auth, async (req, res) => {
  try {
    const projects = await db.query(
      'SELECT p.* FROM projects p JOIN project_members pm ON p.id = pm.project_id WHERE pm.user_id = $1',
      [req.user.id]
    );
    res.json(projects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    const newProject = await db.query(
      'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, req.user.id]
    );

    await db.query(
      'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)',
      [newProject.rows[0].id, req.user.id]
    );

    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const project = await db.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
        if (project.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
