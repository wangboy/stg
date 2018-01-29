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
var BaseUnit = /** @class */ (function (_super) {
    __extends(BaseUnit, _super);
    function BaseUnit() {
        return _super.call(this) || this;
    }
    BaseUnit.changeMode = function (mode, sprite) {
        if (mode == 1) {
            //创建一个发光滤镜
            var glowFilter = new Laya.GlowFilter(MODE_1, 15, 0, 0);
            //设置滤镜集合为发光滤镜
            sprite.filters = [glowFilter];
        }
        else {
            //创建一个发光滤镜
            var glowFilter = new Laya.GlowFilter(MODE_2, 15, 0, 0);
            //设置滤镜集合为发光滤镜
            sprite.filters = [glowFilter];
        }
    };
    return BaseUnit;
}(Laya.Sprite));
//# sourceMappingURL=BaseUnit.js.map