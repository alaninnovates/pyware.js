import { readFileSync, writeFileSync } from 'node:fs';
import { parseHeader, parseGeneralInfo, parseGridPattern, parseCast, parseProductionTab, parsePages } from './parsers/index.js';

function cli() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('Please provide a file path as an argument.');
        process.exit(1);
    }

    try {
        const fileBuffer = readFileSync(filePath);
        const headerInfo = parseHeader(fileBuffer);
        const generalInfo = parseGeneralInfo(fileBuffer.subarray(headerInfo.readSize));
        const gridPattern = parseGridPattern(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize));
        const castSection = parseCast(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize));
        const productionTab = parseProductionTab(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize));
        const pages = parsePages(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize + productionTab.readSize));
        const outputData = {
            headerInfo: headerInfo.data,
            generalInfo: generalInfo.data,
            gridPattern: gridPattern.data,
            cast: castSection.data,
            productionTab: productionTab.data,
            pages: pages.data
        };
        writeFileSync('out.json', JSON.stringify(outputData, null, 2));
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

// cli();

export default function parsePywareFile(buffer: Buffer) {
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
