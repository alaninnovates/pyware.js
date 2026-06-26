import { readUTF8String } from "../util/util.js";

enum TabType {
    StandardPageTab,
    SubPageTab,
    // technically there is Waypoint, but 3da doesnt support this
}

export function parseProductionTab(buffer: Buffer) {
    const productionTabHeader = buffer.subarray(0, 4).toString('utf-8');
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const arrayLength = buffer.subarray(8, 10).readInt16BE(0);
    let bufferForSection = buffer.subarray(10, 10 + sectionSizeBytes - 2);

    const productionTabEntries = [];

    while (bufferForSection.length > 0) {
        const count = bufferForSection.subarray(0, 2).readInt16BE(0);
        const {parsed: measures, remainingBuffer: _rb1} = readUTF8String(bufferForSection.subarray(2, bufferForSection.length));
        const tabType: TabType = _rb1.subarray(0, 1).readInt8(0);
        const {parsed: title, remainingBuffer: _rb2} = readUTF8String(_rb1.subarray(1));
        const {parsed: note1, remainingBuffer: _rb3} = readUTF8String(_rb2);
        const {parsed: note2, remainingBuffer: _rb4} = readUTF8String(_rb3);
        const {parsed: note3, remainingBuffer: _rb5} = readUTF8String(_rb4);
        const {parsed: note4, remainingBuffer: _rb6} = readUTF8String(_rb5);
        const {parsed: note5, remainingBuffer: _rb7} = readUTF8String(_rb6);

        productionTabEntries.push({ count, measures, tabType, title, note1, note2, note3, note4, note5 });

        bufferForSection = _rb7;
    }

    if (productionTabEntries.length !== arrayLength) {
        console.warn(`Warning: Expected ${arrayLength} entries in production tab, but parsed ${productionTabEntries.length}.`);
    }

    return {
        data: {
            arrayLength,
            productionTabHeader,
            sectionSizeBytes,
            productionTabEntries
        },
        readSize: sectionSizeBytes + 8
    };
}