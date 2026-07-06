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
    let gridData = {} as any;
    for (const line of bufferForSection.split('\n')) {
        if (line.trim() === '') continue;
        console.log(line);
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

/*
MRK2 is abt back marker
MARK is abt front marker
MARK ???, distance, size, color
MRK2 distance, flip orientation of back marker (boolean)
*/
            case 'MARK':
            case 'MRK2':


/*
HZTK is yard ticks
HZHS is major hash, shown on major division lines
HZHM is minor hash, shown on sub division lines
HZMJ is division lines
HZMN is sub-division lines
*/
/*
HZMJ/VTMJ
then distance from center
then (1) = show marker or (0) = dont show marker
then ` = empty or custom label
HZHS can also have a label (` = empty again)
HZMN and HZTK and HZHM are normal

ex: HZMJ -26.25 1 `
HZMN -8.75
HZHS -8.75 `
*/
            case 'HZMJ':
            case 'VTMJ':
            case 'HZMN':
            case 'VTMN':
            case 'HZHS':
            case 'VTHS':
            case 'HZHM':
            case 'VTHM':
            case 'HZTK':
            case 'VTTK':

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