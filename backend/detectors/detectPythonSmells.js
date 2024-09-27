import { exec } from 'child_process';

const detectPythonSmells = (filepath, res) => {
    exec(`pylint "${filepath}"`, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.send(stdout);
    });
};

module.exports = detectPythonSmells;
