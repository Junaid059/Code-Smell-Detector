import express from 'express';
import multer  from 'multer';
import path from 'path';
import cors from 'cors';
import detectPythonSmells from './detectors/detectPythonSmells';
import detectJavaSmells from './detectors/detectJavaSmells';
import detectCppSmells from './detectors/detectCppSmells';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Handle file upload and select detection logic based on file extension
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    const ext = path.extname(file.originalname).toLowerCase();

    // Detect based on file extension
    switch (ext) {
        case '.py':
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

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
