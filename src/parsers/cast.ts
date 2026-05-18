import { readUTF8String } from "../util/util.js";

export function parseCast(buffer: Buffer) {
    const castSectionHeader = buffer.subarray(0, 4).toString('utf-8');
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const arrayLength = buffer.subarray(8, 10).readInt16BE(0);
    let bufferForSection = buffer.subarray(10, 10 + sectionSizeBytes - 2);

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

    if (castMembers.length !== arrayLength) {
        console.warn(`Warning: Expected ${arrayLength} cast members, but parsed ${castMembers.length}.`);
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