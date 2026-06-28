import { readUTF8String } from "../util/util.js";

export function parseGeneralInfo(buffer: Buffer) {
    const generalInfoHeader = buffer.subarray(0, 4).toString('utf-8'); // GEN1
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const bufferForSection = buffer.subarray(8, 8 + sectionSizeBytes);

    const {parsed: drillTitle, remainingBuffer: _rb1} = readUTF8String(bufferForSection.subarray(0, sectionSizeBytes));
    const {parsed: authorInfo, remainingBuffer: _rb2} = readUTF8String(_rb1);
    const animationFixedTempoBPM = _rb2.subarray(0, 2).readInt16BE(0);

    const firstSetOffset = 2;
    const firstSet = _rb2.subarray(firstSetOffset, firstSetOffset + 4).readInt32BE(0);

    const symbolFontOffset = firstSetOffset + 4;
    const {parsed: symbolFont} = readUTF8String(_rb2.subarray(symbolFontOffset, symbolFontOffset + sectionSizeBytes));

    return {
        data: {
            generalInfoHeader,
            sectionSizeBytes,
            drillTitle,
            authorInfo,
            animationFixedTempoBPM,
            firstSet,
            symbolFont
        },
        readSize: sectionSizeBytes + 8
    };
}