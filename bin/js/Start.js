// 程序入口
var GameMain = /** @class */ (function () {
    function GameMain() {
        this.pro = new Laya.Label();
        Laya.init(720, 1280, Laya.WebGL);
        Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
        Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
        //   Laya.stage.frameRate = "slow";
        //      Laya.Stat.show();
        Laya.Stat.show();
        this.pro = new Laya.Label();
        this.pro.width = Laya.stage.width;
        this.pro.fontSize = 26;
        this.pro.pos(0, 400);
        this.pro.align = "center";
        this.pro.color = "#f00";
        Laya.stage.addChild(this.pro);
        // Laya.loader.load(["res/atlas/ui.atlas",], Laya.Handler.create(this, this.onLoaded));
        Laya.loader.load([
            {
                url: "war/background.png", type: Laya.Loader.IMAGE
            },
            {
                url: "res/atlas/gameRole.atlas", type: Laya.Loader.ATLAS
            },
            {
                url: "res/atlas/comp.atlas", type: Laya.Loader.ATLAS
            },
            {
                url: "res/atlas/gameUI.atlas", type: Laya.Loader.ATLAS
            },
            {
                url: "res/sound/achievement.mp3", type: Laya.Loader.SOUND
            },
            {
                url: "res/sound/bullet.mp3", type: Laya.Loader.SOUND
            },
            {
                url: "res/sound/enemy1_down.mp3", type: Laya.Loader.SOUND
            },
            {
                url: "res/sound/enemy2_down.mp3", type: Laya.Loader.SOUND
            },
            {
                url: "res/sound/enemy3_down.mp3", type: Laya.Loader.SOUND
            },
            {
                url: "res/sound/enemy3_out.mp3", type: Laya.Loader.SOUND
            },
            {
                url: "res/sound/game_over.mp3", type: Laya.Loader.SOUND
            }
        ], Laya.Handler.create(this, this.onLoaded), Laya.Handler.create(this, this.onLoding, null, false), null, 0, true);
    }
    GameMain.prototype.onLoaded = function () {
        //缓存动画
        Laya.Animation.createFrames(["gameRole/hero_fly1.png", "gameRole/hero_fly2.png"], "hero_fly");
        //缓存集中爆炸动作
        Laya.Animation.createFrames(["gameRole/hero_down1.png", "gameRole/hero_down2.png",
            "gameRole/hero_down3.png", "gameRole/hero_down4.png"], "hero_down");
        //缓存敌机1飞行动作
        Laya.Animation.createFrames(["gameRole/enemy1_fly1.png"], "enemy1_fly");
        //缓存敌机1爆炸动作
        Laya.Animation.createFrames(["gameRole/enemy1_down1.png", "gameRole/enemy1_down2.png", "gameRole/enemy1_down3.png",
            "gameRole/enemy1_down4.png"], "enemy1_down");
        Laya.Animation.createFrames(["gameRole/enemy1_fly1.png"], "enemy1_hit");
        //缓存敌机2飞行动作
        Laya.Animation.createFrames(["gameRole/enemy2_fly1.png"], "enemy2_fly");
        //缓存敌机2爆炸动作
        Laya.Animation.createFrames(["gameRole/enemy2_down1.png", "gameRole/enemy2_down2.png", "gameRole/enemy2_down3.png",
            "gameRole/enemy2_down4.png"], "enemy2_down");
        //缓存敌机2碰撞动作
        Laya.Animation.createFrames(["gameRole/enemy2_hit.png"], "enemy2_hit");
        //缓存敌机3飞行动作
        Laya.Animation.createFrames(["gameRole/enemy3_fly1.png", "gameRole/enemy3_fly2.png"], "enemy3_fly");
        //缓存敌机3爆炸动作
        Laya.Animation.createFrames(["gameRole/enemy3_down1.png", "gameRole/enemy3_down2.png", "gameRole/enemy3_down3.png",
            "gameRole/enemy3_down4.png", "gameRole/enemy3_down5.png", "gameRole/enemy3_down6.png"], "enemy3_down");
        //缓存敌机3碰撞动作
        Laya.Animation.createFrames(["gameRole/enemy3_hit.png"], "enemy3_hit");
        //缓存子弹动画
        Laya.Animation.createFrames(["gameRole/bullet1.png"], "bullet1_fly");
        //缓存强化包
        Laya.Animation.createFrames(["gameRole/ufo1.png"], "ufo1_fly");
        //缓存医疗包
        Laya.Animation.createFrames(["gameRole/ufo2.png"], "ufo2_fly");
        this.pro.removeSelf();
        Laya.stage.addChild(new BackGround());
        //加载游戏主界面
        GameMain.gameInfo = new GameInfo();
        GameMain.gameInfo.init(2);
        GameMain.gameInfo.zOrder = 99; //置最顶
        Laya.stage.addChild(GameMain.gameInfo);
        //开启道具面板
        GameMain.ufo = new Laya.Sprite();
        Laya.stage.addChild(GameMain.ufo);
    };
    GameMain.StartGame = function () {
        //创建主角
        GameMain.hero = new Hero();
        GameMain.hero.create();
        GameMain.hero.zOrder = 99;
        //创建敌人       
        GameMain.difficulty = 0;
        GameMain.enemy = new Laya.Sprite();
        Laya.stage.addChild(GameMain.enemy);
        // Laya.stage.timerLoop(650, this, GameMain.createEnemy);
        Laya.timer.loop(650, this, GameMain.createEnemy);
        //创建UFO
        Laya.timer.loop(1000, this, this.createUFO);
    };
    GameMain.GameOver = function () {
        //隐藏道具面板
        GameMain.gameInfo.btn_boom.visible = false;
        //停止创建敌人
        Laya.timer.clear(this, GameMain.createEnemy);
        //停止UFO
        Laya.timer.clear(this, this.createUFO);
        //自爆所有敌人
        for (var i = GameMain.enemy.numChildren - 1; i >= 0; i--) {
            var enemy = GameMain.enemy.getChildAt(i);
            enemy.hp = 1;
            enemy.lostHP(999999);
        }
        //显示重新开始面板
        GameMain.gameInfo.init(1);
    };
    GameMain.createUFO = function () {
        //平均9秒创建一个
        if (Math.random() <= 0.95)
            return;
        var ufo = Laya.Pool.getItemByClass("ufo", UFO);
        ufo.init();
    };
    GameMain.createEnemy = function () {
        if (GameMain.difficulty < 0.2)
            GameMain.difficulty += 0.001;
        console.log("难度系数:" + this.difficulty);
        var type = Math.random() < (0.75 - GameMain.difficulty) ? 1 : Math.random() < (0.9 - GameMain.difficulty) ? 2 : 3;
        var enemy = Laya.Pool.getItemByClass("enemy", Enemy);
        enemy.init(type);
    };
    GameMain.prototype.onLoding = function (num) {
        this.pro.graphics.clear();
        this.pro.text = "加载:" + Math.round((num * 100)) + "%";
    };
    //根据时间提升难度系数
    GameMain.difficulty = 0;
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=Start.js.map