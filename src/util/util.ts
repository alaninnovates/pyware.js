export function readUTF8String(buffer: Buffer) {
    // length is at the start 2 bytes of the buffer
    const length = buffer.readUInt16BE(0);
    let str = '';
    const byteArr = [];
    for (let i = 2; i < length; i++) {
        const byte = buffer[i];
        if (!byte || byte === 0) {
            break;
        }
        str += String.fromCharCode(byte);
        byteArr.push(byte);
    }
    return {
        parsed: str,
        remainingBuffer: buffer.subarray(2 + byteArr.length)
    };
}