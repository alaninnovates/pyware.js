import { positionToCoordinates } from "./coordinate.js";

function parsePerformerPositionList(buffer: Buffer) {
    const arrayLength = buffer.subarray(0, 2).readInt16BE(0);
    let bufferForSection = buffer.subarray(2, 2 + arrayLength * 14);
    const positions = [];

    for (let i = 0; i < arrayLength; i++) {
        const positionBuffer = bufferForSection.subarray(i * 14, (i + 1) * 14);
        const id = positionBuffer.subarray(0, 2).readInt16BE(0);
        const x = positionBuffer.subarray(2, 6).readInt32BE(0)/625;
        const y = positionBuffer.subarray(6, 10).readInt32BE(0)/625;
        const r = positionBuffer.subarray(10, 11).readInt8(0);
        const g = positionBuffer.subarray(11, 12).readInt8(0);
        const b = positionBuffer.subarray(12, 13).readInt8(0);
        const char = String.fromCharCode(positionBuffer.subarray(13, 14).readInt8(0));
        positions.push({
            id,
            x,
            y,
            color: { r, g, b },
            char
        });
    }

    return {
        arrayLength,
        positions,
    }
}

function parseVisualList(buffer: Buffer) {
    const arrayLength = buffer.subarray(0, 2).readInt16BE(0);

    const visuals = [];
    for (let i = 0; i < arrayLength; i++) {
        const visualBuffer = buffer.subarray(2 + i * 30, 2 + (i + 1) * 30);
        const id = visualBuffer.subarray(0, 2).readInt16BE(0);
        const x = visualBuffer.subarray(2, 6).readInt32BE(0)/625;
        const y = visualBuffer.subarray(6, 10).readInt32BE(0)/625;

        visuals.push({
            id,
            x,
            y
        });
    }

    return {
        arrayLength,
        visuals
    }
}

export function parsePages(buffer: Buffer) {
    const pagesHeader = buffer.subarray(0, 4).toString('utf-8');
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const arrayLength = buffer.subarray(8, 10).readInt16BE(0);
    let bufferForSection = buffer.subarray(10, 10 + sectionSizeBytes - 2);

    const pages = [];

    while (bufferForSection.length > 0) {
        // console.log(bufferForSection);
        const performerPositionList = parsePerformerPositionList(bufferForSection);
        // console.log(performerPositionList.arrayLength);
        const performerPositionListSizeBytes = 2 + performerPositionList.arrayLength * 14;
        bufferForSection = bufferForSection.subarray(performerPositionListSizeBytes);
        // console.log(bufferForSection, performerPositionListSizeBytes);

        const visualList = parseVisualList(bufferForSection);
        // console.log(visualList.arrayLength);
        const visualListSizeBytes = 2 + visualList.arrayLength * 30 /*+ todo: some string size */ + visualList.arrayLength * 2;

        pages.push({
            performerPositionList,
            visualList
        });
        bufferForSection = bufferForSection.subarray(visualListSizeBytes);
    }

    // console.log(pages.length);

    return {
        data: {
            pagesHeader,
            sectionSizeBytes,
            arrayLength,
            pages,
        },
        readSize: sectionSizeBytes + 8
    };
}