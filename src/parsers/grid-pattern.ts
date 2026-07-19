enum Unit {
    Yards,
    Meters,
    Feet
}

enum MeasureDirection {
    Inward,
    Outward
}

enum GridStyle {
    Dots,
    Lines
}

enum GridResolution {
    OneStep,
    TwoStep,
    ThreeStep,
    FourStep
}

function parseColor(color: string[]): { r: number, g: number, b: number } {
    return {
        r: parseInt(color[0]!),
        g: parseInt(color[1]!),
        b: parseInt(color[2]!)
    };
}

export function parseGridPattern(buffer: Buffer) {
    const gridPatternHeader = buffer.subarray(0, 4).toString('utf-8'); // GRD1
    const sectionSizeBytes = buffer.subarray(4, 8).readInt32BE(0);
    const field_4929 = buffer.subarray(8, 10).readInt16BE(0);
    const size = buffer.subarray(10, 14).readInt16BE(0);
    const bufferForSection = buffer.subarray(14, 14 + sectionSizeBytes - 6).toString('utf-8');
    let gridData = {
        horizontalGridLines: [],
        verticalGridLines: [],
    } as any;
    for (const line of bufferForSection.split('\n')) {
        if (line.trim() === '') continue;
        const mark = line.substring(0, 4);
        const data = line.substring(5);
        switch (mark) {
            case 'VERS':
                gridData['version'] = data;
                break;
            case 'TITL':
                gridData['title'] = data;
                break;
            case 'UNIT':
                const unitParts = data.split(' ');
                gridData['unit'] = {
                    type: parseInt(unitParts[0]!),
                    direction: parseInt(unitParts[1]!)
                };
                break;
            case 'GRID':
                const gridParts = data.split(' ');
                gridData['grid'] = {
                    topBottom: {
                        steps: parseInt(gridParts[0]!),
                        perUnit: parseInt(gridParts[1]!)
                    },
                    leftRight: {
                        steps: parseInt(gridParts[2]!),
                        perUnit: parseInt(gridParts[3]!)
                    },
                    style: parseInt(gridParts[4]!),
                    resolution: parseInt(gridParts[5]!),
                    gridLineColor: parseColor(gridParts.slice(6, 9)),
                };
                break;
            case 'PSPC':
                gridData['perspectiveBackgroundColor'] = parseColor(data.split(' '));
                break;
            case 'PSPL':
                gridData['perspectiveLineColor'] = parseColor(data.split(' '));
                break;
            case 'STND':
                const standColors = data.split(' ');
                gridData['standColors'] = {
                    homeStandColor: parseColor(standColors.slice(0, 3)),
                    visitorStandColor: parseColor(standColors.slice(3, 6))
                };
                break;
            case 'VMSR':
                gridData['measureFromStageFront'] = data === '1';
                break;
            case 'BORD':
                const borderParts = data.split(' ');
                gridData['border'] = {
                    left: parseFloat(borderParts[0]!),
                    top: parseFloat(borderParts[1]!),
                    right: parseFloat(borderParts[2]!),
                    bottom: parseFloat(borderParts[3]!),
                    backgroundColor: parseColor(borderParts.slice(4, 7))
                };
                break;
            case 'MAJC':
                gridData['majorLineColor'] = parseColor(data.split(' '));
                break;
            case 'MINC':
                gridData['minorLineColor'] = parseColor(data.split(' '));
                break;
            case 'HASH':
                gridData['hashLineColor'] = parseColor(data.split(' '));
                break;

            case 'MARK':
                gridData['frontMarker'] = {
                    unknownValue: parseFloat(data.split(' ')[0]!),
                    distance: parseFloat(data.split(' ')[1]!),
                    size: parseFloat(data.split(' ')[2]!),
                    color: parseColor(data.split(' ').slice(3, 6))
                };
            case 'MRK2':
                gridData['backMarker'] = {
                    distance: parseFloat(data.split(' ')[0]!),
                    flipOrientation: data.split(' ')[1] === '1'
                };
                break;

            case 'HZMJ':
            case 'VTMJ':
                gridData[mark === 'HZMJ' ? 'horizontalGridLines' : 'verticalGridLines'].push({
                    type: 'divisionLine',
                    distance: parseFloat(data.split(' ')[0]!),
                    showMarker: data.split(' ')[1] === '1',
                    label: data.split(' ')[2] === '`' ? '' : data.split(' ')[2]
                });
                break;
            case 'HZMN':
            case 'VTMN':
                gridData[mark === 'HZMN' ? 'horizontalGridLines' : 'verticalGridLines'].push({
                    type: 'subDivisionLine',
                    distance: parseFloat(data.split(' ')[0]!),
                });
                break;
            case 'HZHS':
            case 'VTHS':
                gridData[mark === 'HZHS' ? 'horizontalGridLines' : 'verticalGridLines'].push({
                    type: 'majorHash',
                    distance: parseFloat(data.split(' ')[0]!),
                    label: data.split(' ')[1] === '`' ? '' : data.split(' ')[1]
                });
                break;
            case 'HZHM':
            case 'VTHM':
                gridData[mark === 'HZHM' ? 'horizontalGridLines' : 'verticalGridLines'].push({
                    type: 'minorHash',
                    distance: parseFloat(data.split(' ')[0]!),
                });
                break;
            case 'HZTK':
            case 'VTTK':
                gridData[mark === 'HZTK' ? 'horizontalGridLines' : 'verticalGridLines'].push({
                    type: 'yardTick',
                    distance: parseFloat(data.split(' ')[0]!),
                });
                break;

            case 'GRND':
                gridData['groundPath'] = data;
                break;
            case 'VENU':
                gridData['venue'] = data;
                break;
            case 'SSKY':
                gridData['sky'] = data;
                break;
            case 'MKFT':
                gridData['markingFont'] = data;
                break;
            case 'LWGT':
                const weights = data.split(' ').map(w => parseFloat(w));
                gridData['lineWeights'] = {
                    sideline: weights[0],
                    endzone: weights[1],
                    divisionLine: weights[2],
                    subDivisionLine: weights[3],
                    stepGrid: weights[4],
                    hashAndTick: weights[5]
                };
                break;
        }
    }


    return {
        data: {
            gridPatternHeader,
            sectionSizeBytes,
            field_4929,
            size,
            gridData
        },
        readSize: sectionSizeBytes + 8
    };
}

export interface GridPattern {
    gridPatternHeader: string;
    sectionSizeBytes: number;
    field_4929: number;
    size: number;
    gridData: any;
}