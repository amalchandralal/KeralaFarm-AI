const fs = require("fs");
const path = require("path");

const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const uploadPhotos = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const uploadedFiles = [];
  for (const file of req.files) {
    // Validate file type
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      // Clean up the invalid file
      try {
        fs.unlinkSync(file.path);
      } catch {
        // Ignore cleanup errors
      }
      continue;
    }

    const ext = path.extname(file.originalname) || ".jpg";
    const newPath = file.path + ext;

    try {
      fs.renameSync(file.path, newPath);
      uploadedFiles.push(newPath.replace("uploads" + path.sep, ""));
    } catch (err) {
      console.error("File rename failed:", err.message);
      // Keep the original path if rename fails
      uploadedFiles.push(file.path.replace("uploads" + path.sep, ""));
    }
  }

  if (uploadedFiles.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid image files were uploaded" });
  }

  res.json(uploadedFiles);
};

module.exports = { uploadPhotos };