var MODE_1 = "#FF1493";
var MODE_2 = "#32CD32";
var POWER_MAX = 10;
function changeUnitMode(mode, sprite) {
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
}
//# sourceMappingURL=Utils.js.map