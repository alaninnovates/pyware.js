// import { readFileSync, writeFileSync } from 'node:fs';
import type { Cast } from './parsers/cast.js';
import type { GeneralInfo } from './parsers/general-info.js';
import type { GridPattern } from './parsers/grid-pattern.js';
import type { HeaderInfo } from './parsers/header.js';
import type { Pages } from './parsers/pages/index.js';
import type { ProductionTab } from './parsers/production-tab.js';
import { parseHeader, parseGeneralInfo, parseGridPattern, parseCast, parseProductionTab, parsePages } from './parsers/index.js';

export type Pyware3DAFile = ReturnType<typeof parsePyware3DAFile>;

export function parsePyware3DAFile(buffer: Buffer) {
    const headerInfo = parseHeader(buffer);
    const generalInfo = parseGeneralInfo(buffer.subarray(headerInfo.readSize));
    const gridPattern = parseGridPattern(buffer.subarray(headerInfo.readSize + generalInfo.readSize));
    const castSection = parseCast(buffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize));
    const productionTab = parseProductionTab(buffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize));
    const pages = parsePages(buffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize + productionTab.readSize));
    return {
        headerInfo: headerInfo.data,
        generalInfo: generalInfo.data,
        gridPattern: gridPattern.data,
        cast: castSection.data,
        productionTab: productionTab.data,
        pages: pages.data
    };
}

export function parsePywareSNCFile(buffer: Buffer) {
    let offset = 0;
    const fileLength = buffer.subarray(offset, offset+2).readInt16BE(0);
    let filePath = "";
    offset += 2;
    for (let i = 0; i < fileLength; i++) {
        filePath += String.fromCharCode(buffer.subarray(offset, offset + 2).readInt16BE(0));
        offset += 2;
    }
    const arrLength = buffer.subarray(offset, offset + 2).readInt16BE(0);
    offset += 2;
    const timestamps = [];
    for (let i = 0; i < arrLength; i++) {
        const timestamp = buffer.subarray(offset, offset + 8).readDoubleBE(0);
        timestamps.push(timestamp);
        offset += 8;
    }
    return {
        filePath,
        arrLength,
        timestamps
    };
}

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