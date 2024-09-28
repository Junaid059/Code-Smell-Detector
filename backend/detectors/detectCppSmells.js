import fs from 'fs';

const LONG_FUNCTION_THRESHOLD = 10;
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
    const functionRegex = /(\w+\s+\w+\s*\(.*\)\s*{[^}]*})/g;
    const functions = code.match(functionRegex) || [];
    functions.forEach(func => {
        const lines = func.split('\n').length;
        if (lines > LONG_FUNCTION_THRESHOLD) {
            smells.push({ type: 'Long Function', details: func });
        }
    });
    return smells;
};


const detectGodClass = (code) => {

    const classRegex = /\bclass\s+(\w+)(?:\s*:\s*(?:public|protected|private)\s+\w+(?:\s*,\s*(?:public|protected|private)\s+\w+)*)?\s*{([\s\S]*?)\n};/g;
    const methodRegex = /(?:(?:inline|virtual|static|explicit)\s+)*(?:[\w:~<>]+\s+)*(\w+)\s*\([^)]*\)\s*(?:const|noexcept|override|final|\s)*(?:=\s*0)?\s*(?:{\s*[\s\S]*?\n\s*}|;)/g;
    const attributeRegex = /(?:(?:static|mutable|volatile|thread_local)\s+)*(?:[\w:*&<>]+\s+)+(\w+)\s*(?:\[[^\]]*\])*\s*(?:=\s*[^;]+)?\s*;/g;

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

        className = className.concat(" Methods: " + methods, " Attributes: " + attributes, " Lines: " + lines);
        if (methods > GOD_CLASS_THRESHOLD.methods ||
            attributes > GOD_CLASS_THRESHOLD.attributes ||
            lines > GOD_CLASS_THRESHOLD.lines) {
            smells = smells.concat({ type: 'God Class', details: className });
        }
    }

    return smells;
}

const detectDuplicatedCode = (code) => {
    const smells = [];
    const lines = code.split('\n');
    const lineCounts = lines.reduce((acc, line) => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            acc[trimmedLine] = (acc[trimmedLine] || 0) + 1;
        }
        return acc;
    }, {});
    for (const [line, count] of Object.entries(lineCounts)) {
        if (count > DUPLICATED_THRESHOLD) {
            smells.push({ type: 'Duplicated Code', details: line });
        }
    }
    return smells;
};

const detectLongParameterLists = (code) => {
    const smells = [];
    const functionRegex = /(\w+\s+\w+\s*\(.*\)\s*{[^}]*})/g;
    const functions = code.match(functionRegex) || [];
    functions.forEach(func => {
        const paramList = func.match(/\(.*\)/)[0];
        const paramCount = (paramList.split(',').length);
        if (paramCount > LONG_PARAMETER_THRESHOLD) {
            smells.push({ type: 'Long Parameter List', details: paramList });
        }
    });
    return smells;
};

const detectMagicNumbers = (code) => {
    const smells = [];
    const magicNumberRegex = /\b\d+\b/g;
    const magicNumbers = code.match(magicNumberRegex) || [];
    magicNumbers.forEach(number => {
        if (number !== '0' && number !== '1') {
            smells.push({ type: 'Magic Number', details: number });
        }
    });
    return smells;
};

const detectDeeplyNestedCode = (code) => {
    const smells = [];
    let maxNesting = 0;
    let currentNesting = 0;
    const lines = code.split('\n');
    lines.forEach(line => {
        if (line.includes('{')) currentNesting++;
        if (line.includes('}')) currentNesting--;
        if (currentNesting > maxNesting) maxNesting = currentNesting;
    });
    if (maxNesting > NESTING_THRESHOLD) {
        smells.push({ type: 'Deeply Nested Code', details: `Nesting level: ${maxNesting}` });
    }
    return smells;
};

const detectCommentedOutCode = (code) => {
    const smells = [];
    const commentedOutCodeRegex = /\/\/.*[;{()}]/g;
    const commentedOutCode = code.match(commentedOutCodeRegex) || [];
    commentedOutCode.forEach(comment => {
        smells.push({ type: 'Commented-Out Code', details: comment });
    });
    return smells;
};


const analyzeCPPCodeSmells = (filePath, res) => {
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

        fs.unlink(filePath, () => { });
        res.json({ smells });
        console.log('Smells:', smells);
    });
}

export { analyzeCPPCodeSmells };

