export function parseProductionTab(buffer: Buffer) {
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