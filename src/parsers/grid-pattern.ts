export function parseGridPattern(buffer: Buffer) {
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