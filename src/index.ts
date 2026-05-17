import { readFileSync, writeFileSync } from 'node:fs';

function readUTF8String(buffer: Buffer) {
    let str = '';
    if (buffer.length < 2) {
        return str;
    }
    for (let i = 2; i < buffer.length; i++) {
        const byte = buffer[i];
        if (!byte || byte === 0) {
            break;
        }
        str += String.fromCharCode(byte);
    }
    return str;
}

function parseHeader(buffer: Buffer) {
    const fileHeader = buffer.subarray(0, 4).toString('utf-8');
    const field_4941 = buffer.subarray(4, 7);
    const field_4942 = buffer.subarray(7, 10);

    return {
        data: {
            fileHeader,
            field_4941,
            field_4942
        },
        readSize: 10
    };
}

function parseGeneralInfo(buffer: Buffer) {
    const generalInfoHeader = buffer.subarray(0, 4).toString('utf-8'); // GEN1
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const bufferForSection = buffer.subarray(8, 8 + sectionSizeBytes);

    const drillTitle = readUTF8String(bufferForSection.subarray(0, sectionSizeBytes));
    const authorInfoOffset = drillTitle.length + 1;
    const authorInfo = readUTF8String(bufferForSection.subarray(authorInfoOffset, authorInfoOffset + sectionSizeBytes));

    const animationFixedTempoBPMOffset = authorInfoOffset + authorInfo.length + 2;
    const animationFixedTempoBPM = bufferForSection.subarray(animationFixedTempoBPMOffset, animationFixedTempoBPMOffset + 2);

    const field_4937Offset = animationFixedTempoBPMOffset + 2;
    const field_4937 = bufferForSection.subarray(field_4937Offset, field_4937Offset + 4);

    const symbolFontOffset = field_4937Offset + 4;
    const symbolFont = readUTF8String(bufferForSection.subarray(symbolFontOffset, symbolFontOffset + sectionSizeBytes));

    return {
        data: {
            generalInfoHeader,
            sectionSizeBytes,
            drillTitle,
            authorInfo,
            animationFixedTempoBPM,
            field_4937,
            symbolFont
        },
        readSize: sectionSizeBytes + 8
    };
}

function parseGridPattern(buffer: Buffer) {
    const gridPatternHeader = buffer.subarray(0, 4).toString('utf-8'); // GRD1
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const bufferForSection = buffer.subarray(8, 8 + sectionSizeBytes);

    return {
        data: {
            gridPatternHeader,
            sectionSizeBytes,
        },
        readSize: sectionSizeBytes + 8
    };
}

function parseCastSection(buffer: Buffer) {
    const castSectionHeader = buffer.subarray(0, 4).toString('utf-8');
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const arrayLength = buffer.subarray(8, 10).readInt16BE(0);
    let bufferForSection = buffer.subarray(10, 10 + sectionSizeBytes-2);

    const castMembers = [];
    while (bufferForSection.length > 0) {
        const id = bufferForSection.subarray(0, 2).readInt16BE(0);
        const name = readUTF8String(bufferForSection.subarray(2, bufferForSection.length));
        const labelOffset = 2 + name.length + 2;
        const label = readUTF8String(bufferForSection.subarray(labelOffset, bufferForSection.length));
        // console.log('Parsed cast member:', { id, name, label });
        castMembers.push({ id, name, label });
        bufferForSection = bufferForSection.subarray(labelOffset + label.length + 2);
    }

    return {
        data: {
            arrayLength,
            castSectionHeader,
            sectionSizeBytes,
            castMembers
        },
        readSize: sectionSizeBytes + 8
    };
}

function parseProductionTab(buffer: Buffer) {
    const productionTabHeader = buffer.subarray(0, 4).toString('utf-8');
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const bufferForSection = buffer.subarray(8, 8 + sectionSizeBytes);
    
    return {
        data: {
            productionTabHeader,
            sectionSizeBytes,
        },
        readSize: sectionSizeBytes + 8
    };
}

function parsePages(buffer: Buffer) {
    const pagesHeader = buffer.subarray(0, 4).toString('utf-8');
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const bufferForSection = buffer.subarray(8, 8 + sectionSizeBytes);
    
    return {
        data: {
            pagesHeader,
            sectionSizeBytes,
        },
        readSize: sectionSizeBytes + 8
    };
}

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
        const castSection = parseCastSection(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize));
        console.log('Cast Section:', castSection);
        const productionTab = parseProductionTab(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize));
        console.log('Production Tab:', productionTab);
        const pages = parsePages(fileBuffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize + productionTab.readSize));
        console.log('Pages:', pages);

        const outputData = {
            headerInfo: headerInfo.data,
            generalInfo: generalInfo.data,
            gridPattern: gridPattern.data,
            castSection: castSection.data,
            productionTab: productionTab.data,
            pages: pages.data
        };
        writeFileSync('out.json', JSON.stringify(outputData, null, 2));
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

main();