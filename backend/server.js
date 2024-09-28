import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { analyzeCPPCodeSmells } from './detectors/detectCPPSmells.js';
import { analyzePythonCodeSmells } from './detectors/detectPythonSmells.js';
import { analyzeJavaCodeSmells } from './detectors/detectJavaSmells.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;

    console.log('Received file:', file);
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    const ext = path.extname(file.originalname).toLowerCase();
    console.log('File extension:', ext);

    switch (ext) {
        case '.py':
            analyzePythonCodeSmells(file.path, res);
            break;
        case '.java':
            analyzeJavaCodeSmells(file.path, res);
            break;
        case '.cpp':
        case '.c':
            analyzeCPPCodeSmells(file.path, res);
            break;
        default:
            res.status(400).send("Unsupported file type.");
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
