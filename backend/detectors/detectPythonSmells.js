import { exec } from 'child_process';

const detectPythonSmells = (filepath, res) => {
    exec(`pylint "${filepath}"`, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing pylint: ${stderr}`);
            return res.status(500).send(`Error: ${stderr}`);
        }

        // Check if there are any pylint messages
        if (stdout) {
            const outputLines = stdout.split('\n').filter(line => line.trim() !== '');
            res.json({
                success: true,
                messages: outputLines,
            });
        } else {
            res.json({
                success: true,
                messages: ['No code smells detected.'],
            });
        }
    });
};

export default detectPythonSmells;
