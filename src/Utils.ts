
const MODE_1: string = "#FF1493";
const MODE_2: string = "#32CD32";

const POWER_MAX:number = 10;

function changeUnitMode(mode: number, sprite: Laya.Sprite): void {
    if (mode == 1) {
        //创建一个发光滤镜
        var glowFilter = new Laya.GlowFilter(MODE_1, 15, 0, 0);
        //设置滤镜集合为发光滤镜
        sprite.filters = [glowFilter];
    } else {
        //创建一个发光滤镜
        var glowFilter = new Laya.GlowFilter(MODE_2, 15, 0, 0);
        //设置滤镜集合为发光滤镜
        sprite.filters = [glowFilter];
    }
}
