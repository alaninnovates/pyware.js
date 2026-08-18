import { parseHeader } from "./parsers/header.js";
import { Reader } from "./reader.js";

export type Pyware3DJFile = ReturnType<typeof parsePyware3DJFile>;

export function parsePyware3DJFile(buffer: Buffer) {
    const reader = new Reader(buffer);
    const headerInfo = parseHeader(reader);
    console.log('Parsed header info:', headerInfo);

    return {
        header: headerInfo
    };
}