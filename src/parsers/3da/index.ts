import { parseHeader } from './header.js';
import { parseGeneralInfo } from './general-info.js';
import { parseGridPattern } from './grid-pattern.js';
import { parseCast } from './cast.js';
import { parseProductionTab } from './production-tab.js';
import { parsePages } from './pages/index.js';

export type Pyware3DAFile = ReturnType<typeof parsePyware3DAFile>;

export function parsePyware3DAFile(buffer: Buffer) {
    const headerInfo = parseHeader(buffer);
    const generalInfo = parseGeneralInfo(buffer.subarray(headerInfo.readSize));
    const gridPattern = parseGridPattern(buffer.subarray(headerInfo.readSize + generalInfo.readSize));
    const castSection = parseCast(buffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize));
    const productionTab = parseProductionTab(buffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize));
    const pages = parsePages(buffer.subarray(headerInfo.readSize + generalInfo.readSize + gridPattern.readSize + castSection.readSize + productionTab.readSize));
    return {
        headerInfo: headerInfo.data,
        generalInfo: generalInfo.data,
        gridPattern: gridPattern.data,
        cast: castSection.data,
        productionTab: productionTab.data,
        pages: pages.data
    };
}