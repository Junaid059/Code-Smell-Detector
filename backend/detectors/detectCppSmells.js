import { exec } from 'child_process';

const detectCppSmells = (filepath, res) => {
    console.log('Checking file:', filepath); // Log the file path for debugging

    exec(`"C:\\Program Files\\Cppcheck\\cppcheck" --enable=all "${filepath}"`, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Cppcheck:', stderr); // Log the error
            return res.status(500).send(`Error: ${stderr}`);
        }

        const output = stderr || stdout; // cppcheck typically sends output to stderr
        console.log('Cppcheck output:', output); // Log the output for debugging

        if (output.trim()) {
            res.send(output);  // Send the detected smells
        } else {
            res.send('No code smells detected.'); // Handle case with no output
        }
    });
};

export default detectCppSmells;
