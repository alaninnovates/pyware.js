import { readFileSync, writeFileSync } from 'node:fs';
import {parseHeader, parseGeneralInfo, parseGridPattern, parseCast, parseProductionTab, parsePages} from './parsers/index.js';

function main() {
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('Please provide a file path as an argument.');
        process.exit(1);
    }

    try {
        const fileBuffer = readFileSync(filePath);
        const headerInfo = parseHeader(fileBuffer);
        console.log('Header Information:', headerInfo);
        const generalInfo = parseGeneralInfo(fileBuffer.subarray(headerInfo.readSize));
        console.log('General Information:', generalInfo);
        const gridPattern = parseGridPattern(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize));
        console.log('Grid Pattern:', gridPattern);
        const castSection = parseCast(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize));
        console.log('Cast:', castSection);
        const productionTab = parseProductionTab(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize));
        console.log('Production Tab:', productionTab);
        const pages = parsePages(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize + productionTab.readSize));
        console.log('Pages:', pages);

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

main();