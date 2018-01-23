/*
* name;
*/
var Move = /** @class */ (function () {
    function Move() {
    }
    Move.MoveToPoint = function (t, v, x, y) {
        if (Math.abs(x - t.x) < v && Math.abs(y - t.y) < v) {
            t.pos(x, y);
            return;
        }
        t.x += v * Math.cos(Math.atan2(y - t.y, x - t.x));
        t.y += v * Math.sin(Math.atan2(y - t.y, x - t.x));
    };
    /*
    如果需要在场景里面循环移动，就这样写
    
                if (this.x >= Laya.stage.width || this.x <= 0) {
                    this.rot = 360 - this.rot;
                }
                if (this.y <= 0 || this.y >= Laya.stage.height) {
                    this.rot = 180 - this.rot;
                }
    */
    Move.MoveByRotation = function (t, v, rota) {
        t.x += v * Math.cos((rota - 90) * Math.PI / 180);
        t.y += v * Math.sin((rota - 90) * Math.PI / 180);
        t.rotation = rota;
    };
    Move.GetRotation = function (t, newX, newY) {
        var angle = (270 + Math.atan2(t.y - newY, t.x - newX) * 180 / Math.PI) % 360;
        return angle;
    };
    return Move;
}());
//# sourceMappingURL=Move.js.map