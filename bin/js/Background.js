var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
* name;
*/
var BackGround = /** @class */ (function (_super) {
    __extends(BackGround, _super);
    function BackGround() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    BackGround.prototype.init = function () {
        this.bg1 = new Laya.Sprite();
        this.bg1.loadImage("war/background.png");
        this.addChild(this.bg1);
        this.bg2 = new Laya.Sprite();
        this.bg2.loadImage("war/background.png");
        this.bg2.y = -Laya.stage.height;
        this.addChild(this.bg2);
        Laya.stage.frameLoop(1, this, this.onLoop);
    };
    BackGround.prototype.onLoop = function () {
        this.bg1.y++;
        this.bg2.y++;
        if (this.bg1.y > Laya.stage.height) {
            this.bg1.y = -Laya.stage.height + 1;
        }
        else if (this.bg2.y > Laya.stage.height) {
            this.bg2.y = -Laya.stage.height + 1;
        }
    };
    return BackGround;
}(Laya.Sprite));
//# sourceMappingURL=Background.js.map