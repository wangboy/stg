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
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super.call(this) || this;
        _this.rota = 0; //发射角度
        return _this;
    }
    Bullet.prototype.init = function (type, rota, v, camp, mode, ad) {
        if (ad === void 0) { ad = 1; }
        this.type = type;
        this.rota = rota;
        this.speed = v;
        this.camp = camp;
        if (ad == 0)
            ad = 1;
        this.ad = ad;
        this.loadImage("gameRole/bullet" + this.camp + ".png");
        this.timer.frameLoop(1, this, this.onMove);
        this.setMode(mode);
        //  this.tar = GameMain.enemy.getChildAt(Math.round(Math.random() * 100 % GameMain.enemy.numChildren)) as Enemy;
    };
    Bullet.prototype.setMode = function (mode) {
        this.mode = mode;
        changeUnitMode(this.mode, this);
    };
    Bullet.prototype.recover = function () {
        //清除子弹移动事件
        this.timer.clear(this, this.onMove);
        this.removeSelf();
        this.graphics.clear();
        this.filters = [];
        Laya.Pool.recover("bullet", this);
    };
    Bullet.prototype.onMove = function () {
        //普通子弹 直线发射
        if (this.type == 1) {
            Move.MoveByRotation(this, this.speed, this.rota);
        }
        else if (this.type == 2) {
            //如果没有目标就随机获取一个            
            if (this.tar == null) {
                this.tar = GameMain.enemy.getChildAt(Math.round(Math.random() * 100 % GameMain.enemy.numChildren));
            }
            // 敌人存在 就跟踪
            if (this.tar != null && this.tar.y > 0) {
                this.rota = Move.GetRotation(this, this.tar.x, this.tar.y);
            }
            Move.MoveByRotation(this, this.speed / 2, this.rota);
        }
        //判断是否超过屏幕
        if (this.x < -20 || this.x > Laya.stage.width + 20 || this.y < -20 || this.y > Laya.stage.height + 20) {
            this.recover();
        }
        //判断是否击中东西
        //如果是自己的子弹， 就判断是否击中敌人
        if (this.camp == 1) {
            for (var i = GameMain.enemy.numChildren - 1; i >= 0; i--) {
                var enemy = GameMain.enemy.getChildAt(i);
                var hitRadius = 1 + enemy.radius[enemy.type - 1];
                //击中了敌机
                if (Math.abs(this.x - enemy.x) < hitRadius && Math.abs(this.y - enemy.y) < hitRadius) {
                    //回收自己
                    this.recover();
                    //敌机掉血
                    enemy.lostHP(this.ad);
                }
            }
        }
        else if (this.camp == 2 && GameMain.hero != null) {
            var hero = GameMain.hero;
            var hitRadius = 1 + hero.hitRadius;
            //击中了自己
            if (Math.abs(this.x - hero.x) < hitRadius && Math.abs(this.y - hero.y) < hitRadius) {
                //回收自己
                this.recover();
                if (this.mode == hero.mode) {
                    hero.addPower(1);
                    GameMain.gameInfo.powerBar.value = hero.power / POWER_MAX;
                }
                else {
                    //自机掉血
                    hero.lostHP();
                }
            }
        }
    };
    return Bullet;
}(Laya.Sprite));
//# sourceMappingURL=Bullet.js.map