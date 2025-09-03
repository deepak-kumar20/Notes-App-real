const User = require('../models/User');

// Get all notes for authenticated user
const getNotes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      notes: user.notes
    });
  } catch (error) {
    console.error('Error getting notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notes'
    });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content, tags, isImportant } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const user = await User.findById(req.user._id);
    await user.addNote({ title, content, tags: tags || [], isImportant: isImportant || false });

    res.json({
      success: true,
      message: 'Note created successfully',
      note: user.notes[user.notes.length - 1] // Get the last added note
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create note'
    });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, tags, isImportant } = req.body;

    const user = await User.findById(req.user._id);
    const result = await user.updateNote(noteId, { title, content, tags, isImportant });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note updated successfully'
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update note'
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const user = await User.findById(req.user._id);
    await user.deleteNote(noteId);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete note'
    });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote
};
