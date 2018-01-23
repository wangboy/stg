/*
* name;
*/
class Move {
    constructor() {

    }


    public static MoveToPoint(t: laya.display.Sprite, v: number, x: number, y: number): void {
        if (Math.abs(x - t.x) < v && Math.abs(y - t.y) < v) {
            t.pos(x, y);
            return;
        }

        t.x += v * Math.cos(Math.atan2(y - t.y, x - t.x));
        t.y += v * Math.sin(Math.atan2(y - t.y, x - t.x));

    }

    /*
    如果需要在场景里面循环移动，就这样写
    
                if (this.x >= Laya.stage.width || this.x <= 0) {
                    this.rot = 360 - this.rot;
                }
                if (this.y <= 0 || this.y >= Laya.stage.height) {
                    this.rot = 180 - this.rot;
                }
    */
    public static MoveByRotation(t: laya.display.Sprite, v: number, rota: number): void {

        t.x += v * Math.cos((rota - 90) * Math.PI / 180);
        t.y += v * Math.sin((rota - 90) * Math.PI / 180);

        t.rotation = rota;
    }

    public static GetRotation(t: laya.display.Sprite, newX: number, newY: number): number {
        var angle: number = (270 + Math.atan2(t.y - newY, t.x - newX) * 180 / Math.PI) % 360;
        return angle;
    }



}