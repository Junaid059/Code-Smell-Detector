import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import detectPythonSmells from './detectors/detectPythonSmells.js';
import detectJavaSmells from './detectors/detectJavaSmells.js';
import detectCppSmells from './detectors/detectCppSmells.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Handle file upload and select detection logic based on file extension
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    console.log('Received file:', file); // Log the received file
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    const ext = path.extname(file.originalname).toLowerCase();
    console.log('File extension:', ext); // Log the file extension

    // Detect based on file extension
    switch (ext) {
        case '.py':
            console.log('Processing Python file:', file.path); // Log the path of the file being processed
            detectPythonSmells(file.path, res);
            break;
        case '.java':
            detectJavaSmells(file.path, res);
            break;
        case '.cpp':
        case '.c':
            detectCppSmells(file.path, res);
            break;
        default:
            res.status(400).send("Unsupported file type.");
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
