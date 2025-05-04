import Note from "../models/Note.js";

export const renderNoteForm = (req, res) => res.render("notes/new-note");

export const createNewNote = async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  
  console.log("Form data received:", req.body); // Add debugging
  
  if (!title) {
    errors.push({ text: "Please Write a Title." });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0)
    return res.render("notes/new-note", {
      errors,
      title,
      description,
    });

  try {
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    
    // Handle file upload if present
    if (req.file) {
      newNote.fileUrl = req.file.buffer.toString('base64');
      newNote.fileType = req.file.mimetype;
    }
    
    await newNote.save();
    req.flash("success_msg", "Note Added Successfully");
    res.redirect("/notes");
  } catch (error) {
    console.error("Error saving note:", error);
    req.flash("error_msg", "Error saving note: " + error.message);
    res.redirect("/notes/add");
  }
};

export const renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("notes/all-notes", { notes });
};

export const renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  if (note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
};

export const updateNote = async (req, res) => {
  const { title, description } = req.body;
  const updateData = { title, description };
  
  // Handle file upload if present
  if (req.file) {
    updateData.fileUrl = req.file.buffer.toString('base64');
    updateData.fileType = req.file.mimetype;
  }
  
  await Note.findByIdAndUpdate(req.params.id, updateData);
  req.flash("success_msg", "Note Updated Successfully");
  res.redirect("/notes");
};

export const getFile = async (req, res) => {
  const note = await Note.findById(req.params.id);
  
  if (!note || note.user != req.user.id) {
    req.flash("error_msg", "Not Authorized");
    return res.redirect("/notes");
  }
  
  if (!note.fileUrl || !note.fileType) {
    req.flash("error_msg", "No file attached to this note");
    return res.redirect("/notes");
  }
  
  const fileBuffer = Buffer.from(note.fileUrl, 'base64');
  res.set('Content-Type', note.fileType);
  res.send(fileBuffer);
};

export const deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
};
