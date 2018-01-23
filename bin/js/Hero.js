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
var Hero = /** @class */ (function (_super) {
    __extends(Hero, _super);
    function Hero() {
        var _this = _super.call(this) || this;
        _this.firerota = 2; //子弹夹角
        _this.fireLevel = 1; //子弹的等级
        _this.hitRadius = 10; //自己的半径
        _this.hp = 0;
        _this.score = 0;
        _this.boomCount = 3;
        return _this;
    }
    //创建主角    
    Hero.prototype.create = function () {
        var _this = this;
        this.playAction("fly");
        this.pivot(this.getBounds().width / 2, this.getBounds().height / 2);
        this.pos(Laya.stage.width / 2, Laya.stage.height);
        //中心闪烁
        this.drawcircle();
        //清零积分 血量
        this.score = 0;
        GameMain.gameInfo.SetScore(this.score);
        this.hp = 5;
        GameMain.gameInfo.SetHP(this.hp);
        this.boomCount = 3;
        GameMain.gameInfo.SetBoomCount(this.boomCount);
        Laya.stage.addChild(this);
        Laya.Tween.to(this, { y: Laya.stage.height / 2 + 200 }, 1000, Laya.Ease.circOut, Laya.Handler.create(this, function () {
            GameMain.gameInfo.btn_boom.visible = true;
            //鼠标移动        
            Laya.stage.frameLoop(1, _this, _this.onMouseMove);
            //发射子弹
            Laya.stage.timerLoop(500, _this, _this.FireBullet);
            //注册播放完毕事件
            _this.on(Laya.Event.COMPLETE, _this, _this.onComplete);
        }));
    };
    Hero.prototype.onMouseMove = function () {
        if (Laya.stage.mouseX < GameMain.gameInfo.btn_boom.width &&
            Laya.stage.mouseY > GameMain.gameInfo.btn_boom.y &&
            Laya.stage.mouseY < GameMain.gameInfo.btn_boom.y + GameMain.gameInfo.btn_boom.height) {
            return;
        }
        Move.MoveToPoint(this, 20, Laya.stage.mouseX, Laya.stage.mouseY - 40);
        //检测是否碰到敌人  以及是否吃到东西    
        for (var i = GameMain.enemy.numChildren - 1; i >= 0; i--) {
            var enemy = GameMain.enemy.getChildAt(i);
            var hitRadius = 1 + enemy.radius[enemy.type - 1];
            //击中了敌机
            if (Math.abs(this.x - enemy.x) < hitRadius && Math.abs(this.y - enemy.y) < hitRadius) {
                //敌机爆
                enemy.hp = 1;
                enemy.lostHP(2);
                //自爆
                this.ChangeColor();
                GameMain.hero.hp = 0;
                GameMain.gameInfo.SetHP(this.hp);
            }
        }
        //检测是否吃到UFO道具
        for (var i = GameMain.ufo.numChildren - 1; i >= 0; i--) {
            var ufo = GameMain.ufo.getChildAt(i);
            var hitRadius = this.hitRadius + ufo.hitRadius;
            //碰到了道具
            if (Math.abs(this.x - ufo.x) < hitRadius && Math.abs(this.y - ufo.y) < hitRadius) {
                ufo.EatUFO();
            }
        }
    };
    //画中心圆
    Hero.prototype.drawcircle = function () {
        var _this = this;
        var sp = new Laya.Sprite();
        this.addChild(sp);
        //闪烁中心点
        var state = 0;
        var cor;
        this.timer.loop(100, this, function () {
            if (state == 0) {
                sp.graphics.clear();
                state = 1;
                return;
            }
            else {
                if (_this.hp < 3) {
                    cor = "#f00";
                }
                else {
                    cor = "#0f0";
                }
                state = 0;
            }
            sp.graphics.drawCircle(_this.pivotX, _this.pivotY, _this.hitRadius, cor);
        });
    };
    Hero.prototype.playAction = function (action) {
        this.action = action;
        this.play(0, true, "hero_" + action);
    };
    //终极武器
    Hero.prototype.FireBoom = function () {
        var _this = this;
        if (this.boomCount <= 0)
            return;
        //减少道具数量
        GameMain.gameInfo.SetBoomCount(--this.boomCount);
        Laya.timer.loop(100, this, this._FireBoom);
        Laya.timer.once(300, this, function () {
            Laya.timer.clear(_this, _this._FireBoom);
        });
    };
    Hero.prototype._FireBoom = function () {
        var b = Laya.Pool.getItemByClass("bullet", Bullet);
        b.init(1, 0, 20, 1, this.fireLevel);
        b.pos(this.x, this.y);
        Laya.stage.addChild(b);
        //最后发射 大火力导弹
        var tRota = 2;
        for (var i = 0; i < 90; i++) {
            //向左发一个
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            b.init(1, -tRota, 20, 1, this.fireLevel);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);
            //再向右发一个            
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            b.init(1, tRota, 20, 1, this.fireLevel);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);
            //加大角度            
            tRota += this.firerota;
        }
    };
    //发射子弹    
    Hero.prototype.FireBullet = function () {
        Laya.SoundManager.playSound("res/sound/bullet.mp3");
        //无论什么等级， 先发射一个普通导弹
        var b = Laya.Pool.getItemByClass("bullet", Bullet);
        b.init(1, 0, 20, 1);
        b.pos(this.x, this.y);
        Laya.stage.addChild(b);
        //再发射跟踪导弹
        for (var i = 0; i < this.fireLevel + 1; i++) {
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            b.init(2, 0, 20, 1);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);
        }
        //最后发射 大火力导弹
        var tRota = 2;
        for (var i = 0; i < this.fireLevel; i++) {
            //向左发一个
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            b.init(1, -tRota, 20, 1);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);
            //再向右发一个            
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            b.init(1, tRota, 20, 1);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);
            //加大角度            
            tRota += this.firerota;
        }
    };
    //加血    
    Hero.prototype.AddHP = function () {
        if (this.hp < 10)
            this.hp++;
        GameMain.gameInfo.SetHP(this.hp);
    };
    //掉血
    Hero.prototype.lostHP = function () {
        if (this.hp > 0) {
            this.hp--;
            //这里开始变色
            this.ChangeColor();
        }
        //减少火力
        if (this.fireLevel > 1)
            this.fireLevel--;
        GameMain.gameInfo.SetHP(this.hp);
    };
    Hero.prototype.ChangeColor = function () {
        var _this = this;
        var redMat = [
            1, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0,
        ];
        var redFilter = new Laya.ColorFilter(redMat);
        this.filters = [redFilter];
        this.timerOnce(100, this, function () {
            _this.filters = null;
        });
    };
    Hero.prototype.onComplete = function () {
        //死了就不发子弹了
        if (this.hp <= 0 && this.action == "fly") {
            this.playAction("down");
            this.timer.clear(this, this.FireBullet);
        }
        else if (this.hp <= 0 && this.action == "down") {
            this.destroy();
            //这里调用GameOver
            GameMain.GameOver();
            GameMain.hero = null;
        }
        else {
            if (this.action != "fly")
                this.playAction("fly");
        }
    };
    return Hero;
}(Laya.Animation));
//# sourceMappingURL=Hero.js.map