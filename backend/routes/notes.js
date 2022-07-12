const express = require("express");
const fetchuser = require("../middlleware/fetchuser");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route:1 Get al the notes using  GET "/api/notes/fetchnotes" login  required
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route:2 Add a new  notes using  POST "/api/notes/addnote" login  required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // if there are eerors retun bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route:3  upate a Existing notes  using  PUT "/api/notes/addnote" login  required
router.put(
  "/updatenote/:id",
  fetchuser,

  async (req, res) => {
    const { title, description, tag } = req.body;
    try {
      // create a newNote Object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (title) {
        newNote.tag = tag;
      }

      // Find the note to be updated and update it
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("not found");
      }

      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);
// Route:4  Delete a Existing notes  using  DELETE"/api/notes/deletenote" login  required
router.delete(
  "/deletenote/:id",
  fetchuser,

  async (req, res) => {
    try {
      // Find the note to be delete and delete it
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("not found");
      }
      //Allow deletion only if  user owns this note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }
      note = await Note.findByIdAndDelete(req.params.id);
      res.json({ Success: "Note has been deleted", note: note });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
