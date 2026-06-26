export function readUTF8String(buffer: Buffer) {
    // length is at the start 2 bytes of the buffer
    console.log(buffer.subarray(0, 2));
    const length = buffer.readUInt16BE(0);
    console.log(length);
    let str = '';
    const byteArr = [];
    // if (buffer.length < 2) {
    //     return str;
    // }
    for (let i = 2; i < length; i++) {
        const byte = buffer[i];
        if (!byte || byte === 0) {
            break;
        }
        str += String.fromCharCode(byte);
        byteArr.push(byte);
        // if (byte === 0x02) {
        //     break;
        // }
    }
    console.log('readUTF8String', { str, byteArr });
    return {
        parsed: str,
        remainingBuffer: buffer.subarray(2 + byteArr.length)
    };
}