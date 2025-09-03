const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/notesController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes in this file
router.use(auth);

// Notes routes
router.get('/', getNotes);
router.post('/', createNote);
router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;
