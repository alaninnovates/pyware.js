import type { Reader } from "../reader.js";

export function parseHeader(reader: Reader) {
    const fileHeader = reader.ascii(4);
    const sectionLength = reader.i32();

    const headerStart = reader.tell();
    const headerEnd = headerStart + sectionLength;

    const majorVersion = reader.i16();
    const field1897 = reader.i16();

    const numGroups = reader.i16(); //?
    const field1904 = reader.i16();
    const field1905 = reader.i16();

    let field1906 = null;
    let field1907 = null;

    const consumed = reader.tell() - headerStart;


    if (
        majorVersion >= 11 ||
        consumed < sectionLength
    ) {
        if (reader.tell() + 16 <= headerEnd) {
            field1906 = reader.i32(); // system time thing?
            field1907 = reader.i32(); // system time thing?
        }
    }

    return {
        fileHeader,
        sectionLength,
        majorVersion,
        field1897,
        numGroups,
        field1904,
        field1905,
        field1906,
        field1907,
    };
}