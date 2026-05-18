export function parseHeader(buffer: Buffer) {
    const fileHeader = buffer.subarray(0, 4).toString('utf-8');
    const field_4941 = buffer.subarray(4, 7);
    const field_4942 = buffer.subarray(7, 10);

    return {
        data: {
            fileHeader,
            field_4941,
            field_4942
        },
        readSize: 10
    };
}