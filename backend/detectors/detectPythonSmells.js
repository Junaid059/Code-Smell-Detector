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
    const functionRegex = /def\s+\w+\s*\(.*\)\s*:\s*\n([\s\S]*?)(?=\ndef\s|\n\w|\n$)/g;
    const functions = [...code.matchAll(functionRegex)];
    functions.forEach(func => {
        const funcBody = func[1].split('\n').filter(line => line.trim());
        if (funcBody.length > LONG_FUNCTION_THRESHOLD) {
            smells.push({ type: 'Long Function', details: func[0].trim() });
        }
    });
    return smells;
};;

// const detectGodClass = (code) => {
//     const smells = [];
//     const classRegex = /class\s+\w+\s*:\s*\n([\s\S]*?)(?=\nclass\s|\n\w|\n$)/g;
//     const classes = [...code.matchAll(classRegex)];
//     classes.forEach(cls => {
//         const classBody = cls[1].split('\n').filter(line => line.trim());
//         if (classBody.length > 200) {
//             smells.push({ type: 'Large Class', details: cls[0].trim() });
//         }
//     });
//     return smells;
// };

const detectGodClass = (code) => {
    const smells = [];
    const classRegex = /class\s+\w+\s*:\s*\n([\s\S]*?)(?=\nclass\s|\n\w|\n$)/g;

    const methodRegex = /def\s+\w+\s*\(/g;
    const variableRegex = /\bself\.\w+\s*=/g;
    const classes = [...code.matchAll(classRegex)];

    classes.forEach(cls => {
        const classBody = cls[1].trim();
        const lines = classBody.split('\n').filter(line => line.trim());
        const methodCount = (classBody.match(methodRegex) || []).length;
        const variableCount = (classBody.match(variableRegex) || []).length;

        if (lines.length > GOD_CLASS_THRESHOLD.lines || methodCount > GOD_CLASS_THRESHOLD.methods || variableCount > GOD_CLASS_THRESHOLD.attributes) {
            smells.push({
                type: 'God Class',
                details: 'Details: ' + cls[0] + ' Lines Of Code: ' + lines.length + ' Methods: ' + methodCount + ' Variables: ' + variableCount,
            });
        }
    });

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
            smells.push({ type: 'Duplicated Code', details: line });
        }
    }
    return smells;
};

const detectLongParameterLists = (code) => {
    const smells = [];
    const functionRegex = /def\s+\w+\s*\(([^)]*)\)\s*:/g;
    let match;

    while ((match = functionRegex.exec(code)) !== null) {
        const paramList = match[1];
        const paramCount = paramList.split(',').filter(param => param.trim() !== '').length;
        if (paramCount > LONG_PARAMETER_THRESHOLD) {
            smells.push({ type: 'Long Parameter List', details: paramList.trim() });
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
            smells.push({ type: 'Magic Number', details: number });
        }
    });
    return smells;
};

const detectDeeplyNestedCode = (code) => {
    const smells = [];
    const lines = code.split('\n');
    const indentationLevels = lines.map(line => line.match(/^\s*/)[0].length / 4); // Assuming 4 spaces per indent
    const maxIndentation = Math.max(...indentationLevels);
    if (maxIndentation > NESTING_THRESHOLD) {
        smells.push({ type: 'Deeply Nested Code', details: `Nesting level: ${maxIndentation}` });
    }
    return smells;
};

const detectCommentedOutCode = (code) => {
    const smells = [];
    const commentedOutCodeRegex = /#.*[=:]/g;
    const commentedOutCode = code.match(commentedOutCodeRegex) || [];
    commentedOutCode.forEach(comment => {
        smells.push({ type: 'Commented-Out Code', details: comment.trim() });
    });
    return smells;
};

function analyzePythonCodeSmells(filePath, res) {
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
    });
}

export { analyzePythonCodeSmells };
