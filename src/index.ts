// import { readFileSync, writeFileSync } from 'node:fs';
export type { Pyware3DAFile } from './parsers/3da/index.js';
export { parsePyware3DAFile } from './parsers/3da/index.js';

export type { PywareSNCFile } from './parsers/snc/index.js';
export { parsePywareSNCFile } from './parsers/snc/index.js';

// function cli() {
//     const filePath = process.argv[2];
//     if (!filePath) {
//         console.error('Please provide a file path as an argument.');
//         process.exit(1);
//     }

//     try {
//         const fileBuffer = readFileSync(filePath);
//         const outputData = parsePyware3DAFile(fileBuffer);
//         writeFileSync('out.json', JSON.stringify(outputData, null, 2));
//     } catch (error) {
//         console.error('Error reading file:', error);
//     }
// }

// cli();