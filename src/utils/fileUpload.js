import multer from "multer";

// Configure storage in memory
const storage = multer.memoryStorage();

// Set up multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export default upload;
