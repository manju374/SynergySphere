const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

router.get('/:projectId', auth, async (req, res) => {
  try {
    const comments = await db.query(
        'SELECT d.id, d.comment, d.created_at, u.name as user_name FROM discussions d JOIN users u ON d.user_id = u.id WHERE d.project_id = $1 ORDER BY d.created_at ASC',
        [req.params.projectId]
    );
    res.json(comments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { projectId, comment } = req.body;

  try {
    const newComment = await db.query(
      'INSERT INTO discussions (project_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [projectId, req.user.id, comment]
    );
    res.status(201).json(newComment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
