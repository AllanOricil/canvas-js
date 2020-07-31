const MAX_POINTS_TO_GENERATE = 50;

const getBezierXY = function (t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
    return {
        x: Math.pow(1 - t, 3) * sx + 3 * t * Math.pow(1 - t, 2) * cp1x +
            3 * t * t * (1 - t) * cp2x + t * t * t * ex,
        y: Math.pow(1 - t, 3) * sy + 3 * t * Math.pow(1 - t, 2) * cp1y +
            3 * t * t * (1 - t) * cp2y + t * t * t * ey
    };
};

const getQuadraticXY = function (t, sx, sy, cp1x, cp1y, ex, ey) {
    return {
        x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cp1x + t * t * ex,
        y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cp1y + t * t * ey
    };
};

const getBezierPoints = function ({
    startPoint,
    controlPoint1,
    controlPoint2,
    endPoint,
    numberOfPointsToGenerate
}) {
    let pts = [];
    let tests = numberOfPointsToGenerate || MAX_POINTS_TO_GENERATE;
    for (let t = 0; t <= tests; t++) {
        let pt = null;
        if (controlPoint2) {
            pt = getBezierXY(t / tests, startPoint.x, startPoint.y, controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        } else {
            pt = getQuadraticXY(t / tests, startPoint.x, startPoint.y, controlPoint1.x, controlPoint1.y, endPoint.x, endPoint.y);
        }
        pts.push(pt);
    }
    return pts;
};


const getPathPointsGivenPath = function (path) {
    let points = [];
    for (let i = 1; i < path.length; i++) {
        const point = path[i];
        if (point.x === path[i - 1].x) {
            const dist = point.y - path[i - 1].y;
            const pointDeltaDistance = dist / MAX_POINTS_TO_GENERATE;
            for (let n = 0; n < MAX_POINTS_TO_GENERATE; n++) {
                points.push({
                    x: point.x,
                    y: path[i - 1].y + pointDeltaDistance * n
                });
            }
        } else if (point.y === path[i - 1].y) {
            const dist = point.x - path[i - 1].x;
            const pointDeltaDistance = dist / MAX_POINTS_TO_GENERATE;
            for (let n = 0; n < MAX_POINTS_TO_GENERATE; n++) {
                points.push({
                    x: path[i - 1].x + pointDeltaDistance * n,
                    y: point.y
                });
            }
        }
    };


    points.push({
        x: path[path.length - 1].x,
        y: path[path.length - 1].y
    });

    return points;
};

export {
    getBezierPoints,
    getPathPointsGivenPath
};