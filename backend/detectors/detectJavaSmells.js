import fs from 'fs';

const LONG_FUNCTION_THRESHOLD = 30;
const GOD_CLASS_THRESHOLD = {
    methods: 2,
    attributes: 3,
    lines: 50
};
const DUPLICATED_THRESHOLD = 3;
const LONG_PARAMETER_THRESHOLD = 2;
const NESTING_THRESHOLD = 4;

const detectLongFunctions = (code) => {
    const smells = [];
    const methodRegex = /public\s+\w+\s+\w+\(.*?\)\s*{/g;
    let match;

    while ((match = methodRegex.exec(code)) !== null) {
        const startIndex = match.index;
        const methodHeader = match[0];
        let braceCount = 1;
        let endIndex = startIndex + methodHeader.length;

        while (braceCount > 0 && endIndex < code.length) {
            if (code[endIndex] === '{') {
                braceCount++;
            } else if (code[endIndex] === '}') {
                braceCount--;
            }
            endIndex++;
        }

        const methodBody = code.slice(startIndex + methodHeader.length, endIndex - 1).split('\n').filter(line => line.trim());
        if (methodBody.length > LONG_FUNCTION_THRESHOLD) {
            smells.push({ type: 'Long Method', details: `Method: ${methodHeader.trim()}` });
        }
    }

    return smells;
};

const detectGodClass = (code) => {
    const classRegex = /\bclass\s+(\w+)\s*{([\s\S]*?)\n}/g;
    const methodRegex = /(?:public|protected|private)?\s*(?:static\s+)?(?:[\w<>\[\]]+\s+)+(\w+)\s*\([^)]*\)\s*{[\s\S]*?}/g;
    const attributeRegex = /(?:public|protected|private)?\s*(?:static\s+)?(?:final\s+)?(?:[\w<>\[\]]+\s+)+(\w+)\s*(?:=\s*[^;]+)?\s*;/g;

    const potentialGodClasses = [];
    let smells = [];

    let classMatch;
    while ((classMatch = classRegex.exec(code)) !== null) {
        let className = classMatch[1];
        const classContent = classMatch[2];

        const methods = (classContent.match(methodRegex) || []).length;
        const attributes = (classContent.match(attributeRegex) || []).length;
        const lines = classContent.split('\n')
            .filter(line => line.trim() !== '' && !line.trim().startsWith('//'))
            .length;

        console.log(`Class: ${className}, Methods: ${methods}, Attributes: ${attributes}, Lines: ${lines}`);

        className = className.concat(" Methods: " + methods, " Attributes: " + attributes, " Lines: " + lines);
        console.log('hrllo' + className);
        if (methods > GOD_CLASS_THRESHOLD.methods ||
            attributes > GOD_CLASS_THRESHOLD.attributes ||
            lines > GOD_CLASS_THRESHOLD.lines) {
            smells = smells.concat({ type: 'God Class', details: className });
        }
    }
    return smells;
};

const detectDuplicatedCode = (code) => {
    const smells = [];
    const lines = code.split('\n').map(line => line.trim());
    const lineCounts = lines.reduce((acc, line) => {
        if (line) {
            acc[line] = (acc[line] || 0) + 1;
        }
        return acc;
    }, {});
    for (const [line, count] of Object.entries(lineCounts)) {
        if (count > DUPLICATED_THRESHOLD) {
            smells.push({ type: 'Duplicated Code', details: `Duplicated line: ${line}` });
        }
    }
    return smells;
};

const detectLongParameterLists = (code) => {
    const smells = [];
    const methodRegex = /(?:public|protected|private)?\s*(?:static\s+)?(?:[\w<>\[\]]+\s+)+(\w+)\s*\(([^)]*)\)\s*{[\s\S]*?}/g;
    let match;

    while ((match = methodRegex.exec(code)) !== null) {
        const paramList = match[2];
        const paramCount = paramList.split(',').filter(param => param.trim() !== '').length;
        if (paramCount > LONG_PARAMETER_THRESHOLD) {
            smells.push({ type: 'Long Parameter List', details: `Method: ${match[1]}, Parameters: ${paramList.trim()}` });
        }
    }

    return smells;
};

const detectMagicNumbers = (code) => {
    const smells = [];
    const magicNumberRegex = /\b\d+\b/g;
    const magicNumbers = code.match(magicNumberRegex) || [];
    magicNumbers.forEach(number => {
        if (number !== '0' && number !== '1') {
            smells.push({ type: 'Magic Number', details: `Magic Number: ${number}` });
        }
    });
    return smells;
};

const detectDeeplyNestedCode = (code) => {
    const smells = [];
    let nestingLevel = 0;
    let maxNestingLevel = 0;
    for (const char of code) {
        if (char === '{') {
            nestingLevel++;
            maxNestingLevel = Math.max(maxNestingLevel, nestingLevel);
        } else if (char === '}') {
            nestingLevel--;
        }
    }
    if (maxNestingLevel > NESTING_THRESHOLD) {
        smells.push({ type: 'Deeply Nested Code', details: `Max Nesting Level: ${maxNestingLevel}` });
    }
    return smells;
};

const detectCommentedOutCode = (code) => {
    const smells = [];
    const commentedOutCodeRegex = /\/\/.*[=:]|\*.*[=:]/g;
    const commentedOutCode = code.match(commentedOutCodeRegex) || [];
    commentedOutCode.forEach(comment => {
        smells.push({ type: 'Commented-Out Code', details: `Commented code: ${comment.trim()}` });
    });
    return smells;
};

function analyzeJavaCodeSmells(filePath, res) {
    // Read the file content
    fs.readFile(filePath, 'utf8', (err, code) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }

        let smells = [];

        smells = smells.concat(detectLongFunctions(code));
        smells = smells.concat(detectGodClass(code));
        smells = smells.concat(detectDuplicatedCode(code));
        smells = smells.concat(detectLongParameterLists(code));
        smells = smells.concat(detectMagicNumbers(code));
        smells = smells.concat(detectDeeplyNestedCode(code));
        smells = smells.concat(detectCommentedOutCode(code));

        // Clean up the uploaded file
        fs.unlink(filePath, () => { });

        // Send the result
        res.json({ smells });

    });
}

export { analyzeJavaCodeSmells };
