import { readUTF8String } from "../util/util.js";

export function parseGeneralInfo(buffer: Buffer) {
    const generalInfoHeader = buffer.subarray(0, 4).toString('utf-8'); // GEN1
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const bufferForSection = buffer.subarray(8, 8 + sectionSizeBytes);

    const drillTitle = readUTF8String(bufferForSection.subarray(0, sectionSizeBytes));
    const authorInfoOffset = drillTitle.length + 1;
    const authorInfo = readUTF8String(bufferForSection.subarray(authorInfoOffset, authorInfoOffset + sectionSizeBytes));

    const animationFixedTempoBPMOffset = authorInfoOffset + authorInfo.length + 2;
    const animationFixedTempoBPM = bufferForSection.subarray(animationFixedTempoBPMOffset, animationFixedTempoBPMOffset + 2).readInt16BE(0);

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