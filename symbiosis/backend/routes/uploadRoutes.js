const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
             // A Multer error occurred when uploading.
             return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(400).json({ message: err.message });
        }
        
        // Everything went fine.
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        res.send(`/${req.file.path.replace(/\\/g, '/')}`);
    });
});

module.exports = router;
