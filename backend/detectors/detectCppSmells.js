import exec from 'child_process';

const detectCppSmells = (filepath, res) => {
    exec(`cppcheck --enable=all ${filepath}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(stderr);
        }
        if (stderr) {
             // Send cppcheck output (warnings/errors) to the frontend
            res.send(stderr);  
        } else {
            res.send(stdout);  
        }
    });
};

module.exports = detectCppSmells;
