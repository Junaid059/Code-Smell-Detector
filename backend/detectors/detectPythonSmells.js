import  exec from 'child_process';

const detectPythonSmells = (filepath, res) => {
    exec(`pylint ${filepath}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(stderr);
        }
        res.send(stdout);  
    });
};

module.exports = detectPythonSmells;