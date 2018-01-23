/*
* name;
*/
class GameInfo extends ui.GameInfoUI {

    private lbl_showScore: Laya.Label;
    constructor() {
        super();

        //注册开始游戏事件        
        this.btn_start.on(Laya.Event.MOUSE_DOWN, this, this.onStart);

        //注册终极武器事件
        this.btn_boom.on(Laya.Event.MOUSE_DOWN, this, this.Boom);
        Laya.stage.on(Laya.Event.KEY_DOWN, this, this.Boom);


        // 注册2个自动缩小字体的方法        
        this.lbl_hp.timerLoop(10, this, () => {
            if (this.lbl_hp.fontSize > 48) {
                this.lbl_hp.fontSize--;
            } else if (this.lbl_hp.fontSize < 48) {

                this.lbl_hp.fontSize = 48;

            }
        });
        //缩小字体
        this.lbl_score.timerLoop(10, this, () => {
            if (this.lbl_score.fontSize > 48) {
                this.lbl_score.fontSize--;
            } else if (this.lbl_score.fontSize < 48) {
                this.lbl_score.fontSize = 48;

            }
        });

    }
    //发射终极子弹
    Boom(e: Laya.Event): void {
        if (
            (GameMain.hero != null && e.type == Laya.Event.MOUSE_DOWN) ||
            (GameMain.hero != null && e.type == Laya.Event.KEY_DOWN && e.keyCode == 32)
        ) {
            GameMain.hero.FireBoom();

        }

    }

    //1是显示积分信息的，  2是显示 飞机大战的    
    init(state: number): void {
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
    }


    onLogoCompete(): void {

        Laya.Tween.to(this.btn_start, { y: 600 }, 800, Laya.Ease.backOut, Laya.Handler.create(this, this.onStartCompete));
    }

    private tempScore: number = 0;
    private add: number = 0;
    onStartCompete(): void {
        //动态显示分数
        this.add = Math.round(parseInt(this.lbl_score.text) / 100);
        if (this.btn_start.skin == "gameUI/restart.png")
            this.timer.loop(10, this, this.ShowScore);

    }

    ShowScore(): void {
        //显示分数
        if ((this.tempScore += this.add) < parseInt(this.lbl_score.text)) {
            this.lbl_showScore.text = "你的积分:" + this.tempScore;

        }
        else {
            this.timer.clear(this, this.ShowScore);
            this.lbl_showScore.text = "你的积分:" + this.lbl_score.text;
        }

    }



    /**
     * 开始游戏事件
     */
    onStart(): void {
        //先移动 开始按钮
        Laya.Tween.to(this.btn_start, { y: Laya.stage.height }, 800, Laya.Ease.backIn, Laya.Handler.create(this, () => {
            //再移动LOGO
            Laya.Tween.to(this.btn_logo, { y: -400 }, 800, Laya.Ease.backIn, Laya.Handler.create(this, () => {
                //最后才是 开始游戏
                GameMain.StartGame();
                //然后显示面板
                this.btn_top.visible = true;

            }));
        }));
    }


    SetHP(value: number): void {
        //如果生命值太低 就变红色
        if (value < 3) {
            this.lbl_hp.color = "#f00";
        }
        else {
            this.lbl_hp.color = "#0f0";
        }
        this.lbl_hp.text = value.toString();
        this.lbl_hp.fontSize = 58;

    }
    //设置终极道具数量
    SetBoomCount(value: number): void {
        if (value < 0) value = 0;
        this.lbl_boomCount.text = "×" + value;
    }

    //设置积分    
    SetScore(value: number): void {
        this.lbl_score.text = value.toString();

        this.lbl_score.fontSize = 58;

    }

}