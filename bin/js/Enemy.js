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
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    // public hitRadius: number = 0;
    function Enemy() {
        var _this = _super.call(this) || this;
        _this.speeds = [5, 3, 1];
        _this.bulletSpeed = 8;
        _this.radius = [25, 35, 75];
        _this.hps = [1, 3, 15];
        _this.hp = 0;
        _this.fireInterval = [1000, 1500, 3000]; //飞机子弹发射间隔
        _this.mode = 1; //1:white -1:black
        return _this;
    }
    Enemy.prototype.init = function (type) {
        this.type = type;
        this.y = -100;
        this.x = Math.random() * Laya.stage.width;
        this.mode = Math.random() > 0.5 ? 1 : -1;
        changeUnitMode(this.mode, this);
        this.playAction("fly");
        //设置轴心点
        this.pivot(this.getBounds().width / 2, this.getBounds().height / 2);
        //移动
        this.frameLoop(1, this, this.onMove);
        //敌人发射子弹
        Laya.stage.timerLoop(this.fireInterval[this.type - 1], this, this.FireBullet);
        //初始化血量
        this.hp = this.hps[this.type - 1] * (GameMain.hero.fireLevel + 1);
        //注册播放完毕事件
        this.on(Laya.Event.COMPLETE, this, this.onComplete);
        if (this.type == 3) {
            Laya.SoundManager.playSound("res/sound/enemy3_out.mp3");
        }
        //添加到敌人列表
        GameMain.enemy.addChild(this);
    };
    Enemy.prototype.playAction = function (action) {
        this.play(0, true, "enemy" + this.type + "_" + action);
    };
    Enemy.prototype.lostHP = function (value) {
        if (this.hp > 0) {
            this.hp -= value;
            if (this.hp < 0)
                this.hp = 0;
            this.playAction("hit");
        }
    };
    Enemy.prototype.onComplete = function () {
        //死了的时候 就要取消发射子弹了        
        if (this.hp == 0) {
            this.hp--;
            this.timer.clear(this, this.FireBullet);
            this.playAction("down");
            Laya.SoundManager.playSound("res/sound/enemy" + this.type + "_down.mp3");
        }
        else if (this.hp < 0) {
            //主角没死了 掉落 加分
            if (GameMain.hero != null) {
                //如果boss死了，掉落
                if (this.type == 3) {
                    var ufo = Laya.Pool.getItemByClass("ufo", UFO);
                    ufo.init(this.x, this.y);
                }
                //中飞机 少概率掉落
                if (this.type == 2) {
                    if (Math.random() <= 0.1) {
                        var ufo = Laya.Pool.getItemByClass("ufo", UFO);
                        ufo.init(this.x, this.y);
                    }
                }
                //根据打死多少血，加多少分
                var score = this.hps[this.type - 1] * (GameMain.hero.fireLevel + 1);
                GameMain.hero.score += score;
                GameMain.gameInfo.SetScore(GameMain.hero.score);
            }
            //回收自己            
            this.recover();
        }
        else {
            this.playAction("fly");
        }
    };
    Enemy.prototype.FireBullet = function () {
        //无论什么等级， 先发射一个直线导弹先
        var b = Laya.Pool.getItemByClass("bullet", Bullet);
        b.init(1, 0, -this.bulletSpeed, 2, this.mode);
        b.pos(this.x, this.y);
        Laya.stage.addChild(b);
        //如果是小飞机 先瞄准一下        
        if (this.type == 1 && GameMain.hero != null) {
            b.rota = Move.GetRotation(b, GameMain.hero.x, GameMain.hero.y);
            b.speed = this.bulletSpeed;
        }
        //子弹夹角
        var tRota = 5;
        var count = this.type - 1;
        //如果是大飞机 火力全开
        if (this.count == 2) {
            count = 36;
        }
        for (var i = 0; i < count; i++) {
            //向左发一个
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            changeUnitMode(this.mode, b);
            b.init(1, -tRota, -this.bulletSpeed, 2, this.mode);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);
            //再向右发一个            
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            changeUnitMode(this.mode, b);
            b.init(1, tRota, -this.bulletSpeed, 2, this.mode);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);
            //加大角度            
            tRota += 5;
        }
    };
    Enemy.prototype.onMove = function () {
        this.y += this.speeds[this.type - 1];
        if (this.y >= Laya.stage.height + 200) {
            this.recover();
        }
    };
    Enemy.prototype.recover = function () {
        this.clear();
        this.y = -100; //为了不被跟踪弹 追踪
        this.timer.clear(this, this.onMove);
        this.removeSelf();
        this.off(Laya.Event.COMPLETE, this, this.onComplete);
        Laya.Pool.recover("enemy", this);
    };
    return Enemy;
}(Laya.Animation));
//# sourceMappingURL=Enemy.js.map