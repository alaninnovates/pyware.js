// convert pyware 1/16 steps into readable coordinate

export type FrontBack =
    | 'Front Side Line'
    | 'Front Hash (HS)'
    | 'Back Hash (HS)'
    | 'Back Side Line';

export type DotbookEntry = {
    side: number;
    sideToSide: {
        yardline: number;
        stepOffset: number;
        stepOffsetDirection: 'Inside' | 'Outside';
    };
    frontToBack: {
        line: FrontBack;
        stepOffset: number;
        stepOffsetDirection: 'In Front Of' | 'Behind';
    };
};

/*
return:
"sideToSide":{"yardline":40,"stepOffset":2,"stepOffsetDirection":"Inside"},
"frontToBack":{"line":"Back Hash (HS)","stepOffset":11.5,"stepOffsetDirection":"In Front Of"}}
*/
function round(value: number) {
    return Math.round(value * 4) / 4;
}

// 8 steps per 5 yards.
// (x, y) represent distance from middle of field
// x- is side 1, x+ is side 2
// y+ is below middle, y- is above middle
// middle of field x is at the 50 yard line
// middle of field y is 42 steps behind the front sideline
// front hash is 14 below middle
export function positionToCoordinates(x: number, y: number): DotbookEntry {
    x /= 625; x = round(x);
    y /= 625; y = round(y);

    const nearestYardline = 50 - Math.abs(Math.round(x / 8) * 5);
    const nearestYardlineSteps = (50 - nearestYardline) * 8/5;
    const sideToSide = {
        yardline: nearestYardline,
        stepOffset: Math.abs(Math.abs(x) - nearestYardlineSteps),
        stepOffsetDirection: Math.abs(x) < nearestYardlineSteps ? 'Inside' : 'Outside'
    };

    let line: FrontBack;
    let stepOffset: number;
    let stepOffsetDirection: 'In Front Of' | 'Behind';
    // -42 to -28 steps: Back Side Line
    // -28 to 0 steps: Back Hash (HS); bh is at -14 steps
    // 0 to 28 steps: Front Hash (HS); fh is at 14 steps
    // 28 to 42 steps: Front Side Line

    if (y <= -28) {
        line = 'Back Side Line';
        stepOffset = Math.abs(y + 42);
        stepOffsetDirection = 'In Front Of';
    } else if (y <= 0) {
        line = 'Back Hash (HS)';
        stepOffset = Math.abs(y + 14);
        stepOffsetDirection = y < -14 ? 'Behind' : 'In Front Of';
    } else if (y <= 28) {
        line = 'Front Hash (HS)';
        stepOffset = Math.abs(y - 14);
        stepOffsetDirection = y > 14 ? 'In Front Of' : 'Behind';
    } else {
        line = 'Front Side Line';
        stepOffset = Math.abs(y - 42);
        stepOffsetDirection = 'Behind';
    }

    return {
        side: x < 0 ? 1 : 2,
        sideToSide,
        frontToBack: {
            line,
            stepOffset,
            stepOffsetDirection
        }
    } as DotbookEntry;
}