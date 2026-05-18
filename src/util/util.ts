export function readUTF8String(buffer: Buffer) {
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
        if (byte === 0x02) {
            break;
        }
    }
    return str;
}