var Util = {};

Util.getPolygon = function (x, y, radius, edges) {
    var points = [];
    for (var i = 0; i < edges; i++) {
        points.push(x + radius * Math.cos(2 * Math.PI * i / edges));
        points.push(y + radius * Math.sin(2 * Math.PI * i / edges));
    }
    return points;
}

Util.getClosestPointOnCircumference = function (cx, cy, cr, x, y) {
    var vx = x - cx,
        vy = y - cy,
        magV = Math.sqrt(vx * vx + vy * vy);
    return [(cx + vx / magV * cr), (cy + vy / magV * cr)];
}

Util.getDistance = function(x1,y1,x2,y2) {
    var x = Math.abs(x1-x2),
        y = Math.abs(y1-y2);
    return Math.sqrt(x*x + y*y);
}

Util.path = function (fromX, fromY, toX, toY) {
    return ["M", fromX, fromY, "Q", App.view.constants.centerX, App.view.constants.centerY, toX, toY].join(" ");
}

Util.pathReplaceFromPoint = function (path, fromX, fromY) {
    path = path || "M 0 0 Q " + App.view.constants.centerX + " " + App.view.constants.centerY + " 0 0";
//    path = path || "M 0 0 Q 0 0 0 0";
    var frags = path.split(" ");
    frags[1] = fromX;
    frags[2] = fromY;
    return frags.join(" ");
}

Util.pathReplaceToPoint = function (path, toX, toY) {
//    path = path || "M 0 0 Q 0 0 0 0";
    path = path || "M 0 0 Q " + App.view.constants.centerX + " " + App.view.constants.centerY + " 0 0";
    var frags = path.split(" ");
    frags[6] = toX;
    frags[7] = toY;
    return frags.join(" ");
}
