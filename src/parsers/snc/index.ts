export type PywareSNCFile = ReturnType<typeof parsePywareSNCFile>;

export function parsePywareSNCFile(buffer: Buffer) {
    let offset = 0;
    const fileLength = buffer.subarray(offset, offset + 2).readInt16BE(0);
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