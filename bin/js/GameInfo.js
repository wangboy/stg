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
var GameInfo = /** @class */ (function (_super) {
    __extends(GameInfo, _super);
    function GameInfo() {
        var _this = _super.call(this) || this;
        _this.tempScore = 0;
        _this.add = 0;
        //注册开始游戏事件        
        _this.btn_start.on(Laya.Event.MOUSE_DOWN, _this, _this.onStart);
        //注册终极武器事件
        _this.btn_boom.on(Laya.Event.MOUSE_DOWN, _this, _this.Boom);
        Laya.stage.on(Laya.Event.KEY_DOWN, _this, _this.Boom);
        _this.btn_mode.on(Laya.Event.MOUSE_DOWN, _this, _this.changeMode);
        _this.powerBar.value = 0;
        _this.powerBar.on(Laya.Event.MOUSE_DOWN, _this, _this.powerAction);
        // 注册2个自动缩小字体的方法        
        _this.lbl_hp.timerLoop(10, _this, function () {
            if (_this.lbl_hp.fontSize > 48) {
                _this.lbl_hp.fontSize--;
            }
            else if (_this.lbl_hp.fontSize < 48) {
                _this.lbl_hp.fontSize = 48;
            }
        });
        //缩小字体
        _this.lbl_score.timerLoop(10, _this, function () {
            if (_this.lbl_score.fontSize > 48) {
                _this.lbl_score.fontSize--;
            }
            else if (_this.lbl_score.fontSize < 48) {
                _this.lbl_score.fontSize = 48;
            }
        });
        return _this;
    }
    GameInfo.prototype.powerAction = function (e) {
        if (this.powerBar.value === 1) {
            this.Boom(e);
            this.powerBar.value = 0;
        }
    };
    GameInfo.prototype.changeMode = function (e) {
        var hero = GameMain.hero;
        if ((hero != null && e.type == Laya.Event.MOUSE_DOWN)) {
            hero.changeMode();
        }
    };
    //发射终极子弹
    GameInfo.prototype.Boom = function (e) {
        if ((GameMain.hero != null && e.type == Laya.Event.MOUSE_DOWN) ||
            (GameMain.hero != null && e.type == Laya.Event.KEY_DOWN && e.keyCode == 32)) {
            GameMain.hero.FireBoom();
        }
    };
    //1是显示积分信息的，  2是显示 飞机大战的    
    GameInfo.prototype.init = function (state) {
        this.btn_logo.y = -400;
        this.btn_start.y = Laya.stage.height;
        if (state == 1) {
            //不知道这样做 是否能节省性能， 应该可以吧？但是为了避免重复初始化 也必须这样做
            if (this.btn_start.skin != "gameUI/restart.png") {
                this.btn_start.skin = "gameUI/restart.png";
                this.btn_logo.sizeGrid = "5,5,5,5";
                this.btn_logo.skin = "gameUI/bg.jpg";
                this.lbl_showScore = new Laya.Label();
                this.lbl_showScore.width = this.btn_logo.width;
                this.lbl_showScore.align = "center";
                this.lbl_showScore.pos(0, 80);
                this.lbl_showScore.fontSize = 48;
                this.btn_logo.addChild(this.lbl_showScore);
            }
            this.lbl_showScore.text = "你的积分:0";
        }
        else if (state == 2) {
            this.btn_start.skin = "gameUI/start.png";
        }
        //初始化字体大小
        this.tempScore = 0;
        this.lbl_hp.fontSize = this.lbl_score.fontSize = 48;
        Laya.Tween.to(this.btn_logo, { y: 250 }, 800, Laya.Ease.bounceOut, Laya.Handler.create(this, this.onLogoCompete));
    };
    GameInfo.prototype.onLogoCompete = function () {
        Laya.Tween.to(this.btn_start, { y: 600 }, 800, Laya.Ease.backOut, Laya.Handler.create(this, this.onStartCompete));
    };
    GameInfo.prototype.onStartCompete = function () {
        //动态显示分数
        this.add = Math.round(parseInt(this.lbl_score.text) / 100);
        if (this.btn_start.skin == "gameUI/restart.png")
            this.timer.loop(10, this, this.ShowScore);
    };
    GameInfo.prototype.ShowScore = function () {
        //显示分数
        if ((this.tempScore += this.add) < parseInt(this.lbl_score.text)) {
            this.lbl_showScore.text = "你的积分:" + this.tempScore;
        }
        else {
            this.timer.clear(this, this.ShowScore);
            this.lbl_showScore.text = "你的积分:" + this.lbl_score.text;
        }
    };
    /**
     * 开始游戏事件
     */
    GameInfo.prototype.onStart = function () {
        var _this = this;
        //先移动 开始按钮
        Laya.Tween.to(this.btn_start, { y: Laya.stage.height }, 800, Laya.Ease.backIn, Laya.Handler.create(this, function () {
            //再移动LOGO
            Laya.Tween.to(_this.btn_logo, { y: -400 }, 800, Laya.Ease.backIn, Laya.Handler.create(_this, function () {
                //最后才是 开始游戏
                GameMain.StartGame();
                //然后显示面板
                _this.btn_top.visible = true;
            }));
        }));
    };
    GameInfo.prototype.SetHP = function (value) {
        //如果生命值太低 就变红色
        if (value < 3) {
            this.lbl_hp.color = "#f00";
        }
        else {
            this.lbl_hp.color = "#0f0";
        }
        this.lbl_hp.text = value.toString();
        this.lbl_hp.fontSize = 58;
    };
    //设置终极道具数量
    GameInfo.prototype.SetBoomCount = function (value) {
        if (value < 0)
            value = 0;
        this.lbl_boomCount.text = "×" + value;
    };
    //设置积分    
    GameInfo.prototype.SetScore = function (value) {
        this.lbl_score.text = value.toString();
        this.lbl_score.fontSize = 58;
    };
    return GameInfo;
}(ui.GameInfoUI));
//# sourceMappingURL=GameInfo.js.map