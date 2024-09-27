import { exec } from 'child_process';

const detectCppSmells = (filepath, res) => {
    exec(`"C:\\Program Files\\Cppcheck\\cppcheck" --enable=all "${filepath}"`, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.send(stderr || stdout);  // cppcheck outputs to stderr by default
    });
};

module.exports = detectCppSmells;
