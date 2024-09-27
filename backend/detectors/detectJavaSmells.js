import fs from 'fs';
import { exec } from 'child_process';
import { parseStringPromise } from 'xml2js'; // Add xml2js to parse XML

const detectJavaSmells = (filepath, res) => {
    const checkstylePath = 'C:\\Users\\junaid khalid\\Desktop\\checkstyle\\checkstyle-10.18.1-all.jar';  
    const rulesFilePath = 'C:\\Users\\junaid khalid\\Desktop\\checkstyle\\google_checks.xml';  
    
    // Check if the Checkstyle JAR file exists
    fs.access(checkstylePath, fs.constants.R_OK, (err) => {
        if (err) {
            console.error('No access to Checkstyle JAR file:', err);
            return res.status(500).send('No access to Checkstyle JAR file.');
        }
        
        console.log('Running Checkstyle on file:', filepath);
        
        exec(`java -jar "${checkstylePath}" -c "${rulesFilePath}" -f xml "${filepath}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error('Checkstyle error:', stderr);
                return res.status(500).send(`Checkstyle execution error: ${stderr}`);
            }

            // Log Checkstyle output for debugging
            console.log('Checkstyle output:', stdout);

            // Parse the XML output
            try {
                const result = await parseStringPromise(stdout);
                const messages = [];

                // Extract relevant information from the parsed XML
                if (result.checkstyle.file) {
                    result.checkstyle.file.forEach(file => {
                        if (file.error) {
                            file.error.forEach(error => {
                                messages.push(`Line ${error.$.line}: ${error.$.message} (${error.$.source})`);
                            });
                        }
                    });
                }

                // Send the formatted Checkstyle results to the frontend
                res.send(messages.length > 0 ? messages.join('\n') : 'No code smells detected.');
            } catch (parseError) {
                console.error('Error parsing XML:', parseError);
                return res.status(500).send('Error processing Checkstyle output.');
            }
        });
    });
};

export default detectJavaSmells;
