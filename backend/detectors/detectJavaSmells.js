import exec from 'child_process';
import path from 'path';

const detectJavaSmells = (filepath, res) => {
      // Update the version if needed
    const checkstylePath = path.resolve('checkstyle-10.3.3-all.jar');  
    const rulesFilePath = path.resolve('google_checks.xml');  

    exec(`java -jar ${checkstylePath} -c ${rulesFilePath} ${filepath}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(stderr);
        }
        res.send(stdout);  
    });
};

module.exports = detectJavaSmells;
