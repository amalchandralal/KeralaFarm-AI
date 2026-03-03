const express = require("express");
const router = express.Router();
const photosMiddleware = require("../middleware/upload");
const { uploadPhotos } = require("../controllers/uploadController");

router.post("/", photosMiddleware.array("photos", 100), uploadPhotos);

module.exports = router;