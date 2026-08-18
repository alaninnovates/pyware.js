import { parseHeader } from "./parsers/header.js";
import type { Reader } from "./reader.js";

function skipParsing(reader: Reader) {
    const header = reader.ascii(4);
    const sectionLength = reader.i32();

    reader.skip(sectionLength);
}

export const PARSERS = {
    "3DJV": parseHeader,
};

export const KNOWN_CHUNKS = new Set([
    "PRPT",
    "PRP1",
    "PREF",
    "PRF2",
    "PRF3",
    "PTL1",

    "COVR",
    "CVR1",

    "GRID",
    "GRD1",

    "CAST",
    "CST2",
    "CST3",
    "CST6",
    "CST7",

    "PTAB",
    "PTB2",
    "PTB5",
    "PTB6",
    "PTBC",
    "PTBT",
    "PTBI",
    "PTB7",
    "PTU1",

    "TLL2",

    "FMAP",
    "RMAP",
    "COLR",

    "PLST",
    "PLS1",
    "PLS2",

    "PAGE",
    "PG11",
    "PG15",

    "PROP",
    "PRP6",
    "PRP7",
    "PRPM",
    "PRP8",

    "SEL1",
    "SEL2",

    "VIS1",
    "VIS2",
    "CAM1",

    "VsD1",
    "TxD1",

    "FAB1",
    "FAV1",
    "FAV2",

    "SYNC",
    "HYP1",
    "FACE",

    "COM1",
    "COM2",

    "CORD",
    "DT01",

    "END."
]);