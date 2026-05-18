import { readUTF8String } from "../util/util.js";

export function parseProductionTab(buffer: Buffer) {
    const productionTabHeader = buffer.subarray(0, 4).toString('utf-8');
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const arrayLength = buffer.subarray(8, 10).readInt16BE(0);
    let bufferForSection = buffer.subarray(10, 10 + sectionSizeBytes - 2);

    const productionTabEntries = [];

    while (bufferForSection.length > 0) {
        console.log(bufferForSection);
        const count = bufferForSection.subarray(0, 2).readInt16BE(0);
        const field_4962 = readUTF8String(bufferForSection.subarray(2, bufferForSection.length));
        const field_4963 = bufferForSection.subarray(2 + field_4962.length + 2, bufferForSection.length).readInt8(0);
        const field_4969Offset = 2 + field_4962.length + 3;
        const field_4969 = readUTF8String(bufferForSection.subarray(field_4969Offset, bufferForSection.length));
        const note1Offset = field_4969Offset + field_4969.length + 1;
        const note1 = readUTF8String(bufferForSection.subarray(note1Offset, bufferForSection.length));
        const note2Offset = note1Offset + note1.length + 1;
        const note2 = readUTF8String(bufferForSection.subarray(note2Offset, bufferForSection.length));
        const note3Offset = note2Offset + note2.length + 1;
        const note3 = readUTF8String(bufferForSection.subarray(note3Offset, bufferForSection.length));
        const note4Offset = note3Offset + note3.length + 1;
        const note4 = readUTF8String(bufferForSection.subarray(note4Offset, bufferForSection.length));
        const note5Offset = note4Offset + note4.length + 1;
        const note5 = readUTF8String(bufferForSection.subarray(note5Offset, bufferForSection.length));

        productionTabEntries.push({ count, field_4962, field_4963, field_4969, note1, note2, note3, note4, note5 });

        bufferForSection = bufferForSection.subarray(note5Offset + note5.length + 2);
    }

    return {
        data: {
            productionTabHeader,
            sectionSizeBytes,
            productionTabEntries
        },
        readSize: sectionSizeBytes + 8
    };
}