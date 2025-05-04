import Note from "../models/Note.js";

export const renderNoteForm = (req, res) => res.render("notes/new-note");

export const createNewNote = async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  
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
    const newNote = await Note.create({
      title,
      description,
      userId: req.user.id,
      fileUrl: req.file ? req.file.buffer.toString('base64') : null,
      fileType: req.file ? req.file.mimetype : null
    });
    
    console.log("Note created with ID:", newNote.id);
    req.flash("success_msg", "Note Added Successfully");
    res.redirect("/notes");
  } catch (error) {
    console.error("Error saving note:", error);
    req.flash("error_msg", "Error saving note: " + error.message);
    res.redirect("/notes/add");
  }
};

export const renderNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      // Add this to convert Sequelize instances to plain objects
      raw: false
    });
    
    // Convert Sequelize instances to plain JavaScript objects
    const plainNotes = notes.map(note => note.get({ plain: true }));
    
    res.render("notes/all-notes", { notes: plainNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    req.flash("error_msg", "Error fetching notes");
    res.redirect("/");
  }
};

export const renderEditForm = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    
    if (!note) {
      req.flash("error_msg", "Note not found");
      return res.redirect("/notes");
    }
    
    if (note.userId !== req.user.id) {
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/notes");
    }
    
    res.render("notes/edit-note", { note });
  } catch (error) {
    console.error("Error fetching note:", error);
    req.flash("error_msg", "Error fetching note");
    res.redirect("/notes");
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };
    
    // Handle file upload if present
    if (req.file) {
      updateData.fileUrl = req.file.buffer.toString('base64');
      updateData.fileType = req.file.mimetype;
    }
    
    const note = await Note.findByPk(req.params.id);
    
    if (!note) {
      req.flash("error_msg", "Note not found");
      return res.redirect("/notes");
    }
    
    if (note.userId !== req.user.id) {
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/notes");
    }
    
    await note.update(updateData);
    req.flash("success_msg", "Note Updated Successfully");
    res.redirect("/notes");
  } catch (error) {
    console.error("Error updating note:", error);
    req.flash("error_msg", "Error updating note");
    res.redirect("/notes");
  }
};

export const getFile = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    
    if (!note) {
      req.flash("error_msg", "Note not found");
      return res.redirect("/notes");
    }
    
    if (note.userId !== req.user.id) {
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
  } catch (error) {
    console.error("Error fetching file:", error);
    req.flash("error_msg", "Error fetching file");
    res.redirect("/notes");
  }
};

export const deleteNote = async (req, res) => {
  try {
    console.log("Deleting note with ID:", req.params.id);
    
    if (!req.params.id) {
      console.error("No ID provided for deletion");
      req.flash("error_msg", "No note ID provided");
      return res.redirect("/notes");
    }
    
    const note = await Note.findByPk(req.params.id);
    
    if (!note) {
      console.error("Note not found with ID:", req.params.id);
      req.flash("error_msg", "Note not found");
      return res.redirect("/notes");
    }
    
    if (note.userId !== req.user.id) {
      console.error("User not authorized to delete note:", req.params.id);
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/notes");
    }
    
    await note.destroy();
    console.log("Note successfully deleted:", req.params.id);
    req.flash("success_msg", "Note Deleted Successfully");
    res.redirect("/notes");
  } catch (error) {
    console.error("Error deleting note:", error);
    req.flash("error_msg", "Error deleting note");
    res.redirect("/notes");
  }
};
