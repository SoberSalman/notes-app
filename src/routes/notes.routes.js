import { Router } from "express";
import {
  renderNoteForm,
  createNewNote,
  renderNotes,
  renderEditForm,
  updateNote,
  deleteNote,
  getFile,
} from "../controllers/notes.controller.js";
import { isAuthenticated } from "../helpers/auth.js";
import upload from "../utils/fileUpload.js";

const router = Router();

// New Note
router.get("/notes/add", isAuthenticated, renderNoteForm);

router.post("/notes/new-note", isAuthenticated, upload.single('file'), createNewNote);

// Get All Notes
router.get("/notes", isAuthenticated, renderNotes);

// Get File
router.get("/notes/file/:id", isAuthenticated, getFile);

// Edit Notes
router.get("/notes/edit/:id", isAuthenticated, renderEditForm);

router.put("/notes/edit-note/:id", isAuthenticated, upload.single('file'), updateNote);

// Delete Notes
router.delete("/notes/delete/:id", isAuthenticated, deleteNote);

export default router;
