/*
* name;
*/
class Hero extends Laya.Animation {
    constructor() {
        super();
    }

    public firerota: number = 2;    //子弹夹角
    public fireLevel: number = 1;   //子弹的等级
    public hitRadius: number = 10;  //自己的半径
    public hp: number = 0;
    public score: number = 0;
    public boomCount: number = 3;

    private followMouse: boolean = false;
    private lastMouseX: number = 0;
    private lastMouseY: number = 0;

    public mode: number = 1;
    public power: number = 0;

    //创建主角    
    create(): void {

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

        this.mode = 1;
        changeUnitMode(this.mode, this);

        this.power = 0;
        Laya.stage.addChild(this);


        Laya.Tween.to(this, { y: Laya.stage.height / 2 + 200 }, 1000, Laya.Ease.circOut, Laya.Handler.create(this, () => {

            GameMain.gameInfo.btn_boom.visible = true;

            Laya.stage.mouseEnabled = true;
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);

            //鼠标移动        
            Laya.stage.frameLoop(1, this, this.onMouseMove);

            //发射子弹
            Laya.stage.timerLoop(500, this, this.FireBullet);

            //注册播放完毕事件
            this.on(Laya.Event.COMPLETE, this, this.onComplete);

        }));

    }

    onMouseUp(): void {
        // console.log(" onMouseUp ")
        this.followMouse = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
    }

    onMouseDown(): void {
        // console.log(" onMouseDown ")
        this.followMouse = true;
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
    }

    onMouseMove(): void {
        if (!this.followMouse) {
            return;
        }
        if (
            Laya.stage.mouseX < GameMain.gameInfo.btn_boom.width &&
            Laya.stage.mouseY > GameMain.gameInfo.btn_boom.y &&
            Laya.stage.mouseY < GameMain.gameInfo.btn_boom.y + GameMain.gameInfo.btn_boom.height
        ) {
            return;
        }
        var moveX = Laya.stage.mouseX - this.lastMouseX;
        var moveY = Laya.stage.mouseY - this.lastMouseY;
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;

        // Move.MoveToPoint(this, 20, Laya.stage.mouseX, Laya.stage.mouseY - 40);
        //动画移动
        Move.MoveToPoint(this, 20, this.x + moveX, this.y + moveY);
        //直接设置
        // this.x = this.x + moveX;
        // this.y = this.y + moveY;
        // if (this.x > Laya.stage.width) { this.x = Laya.stage.width; }
        // if (this.x < 0) { this.x = 0; }
        // if (this.y > Laya.stage.height) { this.y = Laya.stage.height; }
        // if (this.y < 0) { this.y = 0; }


        //检测是否碰到敌人  以及是否吃到东西    
        for (var i = GameMain.enemy.numChildren - 1; i >= 0; i--) {
            var enemy: Enemy = GameMain.enemy.getChildAt(i) as Enemy;

            var hitRadius: number = 1 + enemy.radius[enemy.type - 1];
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
            var ufo: UFO = GameMain.ufo.getChildAt(i) as UFO;

            var hitRadius: number = this.hitRadius + ufo.hitRadius;
            //碰到了道具
            if (Math.abs(this.x - ufo.x) < hitRadius && Math.abs(this.y - ufo.y) < hitRadius) {

                ufo.EatUFO();
            }
        }
    }

    //画中心圆
    drawcircle(): void {
        var sp: Laya.Sprite = new Laya.Sprite();
        this.addChild(sp);
        //闪烁中心点
        var state: number = 0;
        var cor: string;
        this.timer.loop(100, this, () => {
            if (state == 0) {
                sp.graphics.clear();
                state = 1;
                return;
            }
            else {

                if (this.hp < 3) {
                    cor = "#f00";
                }
                else {
                    cor = "#0f0";
                }

                state = 0;
            }

            sp.graphics.drawCircle(this.pivotX, this.pivotY, this.hitRadius, cor);

        });


    }
    public action: string;
    playAction(action: string): void {
        this.action = action;
        this.play(0, true, "hero_" + action);
    }

    //终极武器
    FireBoom(): void {

        // if (this.boomCount <= 0) return;
        //减少道具数量
        // GameMain.gameInfo.SetBoomCount(--this.boomCount);
        
        this.power = 0;

        Laya.timer.loop(100, this, this._FireBoom);

        Laya.timer.once(300, this, () => {
            Laya.timer.clear(this, this._FireBoom);
        });
    }

    private _FireBoom(): void {
        var b: Bullet = Laya.Pool.getItemByClass("bullet", Bullet);
        b.init(1, 0, 20, 1, this.fireLevel);
        b.pos(this.x, this.y);
        Laya.stage.addChild(b);

        //最后发射 大火力导弹
        var tRota: number = 2;
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
    }


    //发射子弹    
    FireBullet(): void {
        Laya.SoundManager.playSound("res/sound/bullet.mp3");

        //无论什么等级， 先发射一个普通导弹
        var b: Bullet = Laya.Pool.getItemByClass("bullet", Bullet);
        b.init(1, 0, 20, 1, this.mode);
        b.pos(this.x, this.y);
        Laya.stage.addChild(b);

        //再发射跟踪导弹
        for (var i = 0; i < this.fireLevel + 1; i++) {
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            b.init(2, 0, 20, 1, this.mode);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);

        }

        //最后发射 大火力导弹
        var tRota: number = 2;
        for (var i = 0; i < this.fireLevel; i++) {
            //向左发一个
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            b.init(1, -tRota, 20, 1, this.mode);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);

            //再向右发一个            
            b = Laya.Pool.getItemByClass("bullet", Bullet);
            b.init(1, tRota, 20, 1, this.mode);
            b.pos(this.x, this.y);
            Laya.stage.addChild(b);

            //加大角度            
            tRota += this.firerota;

        }
    }

    addPower(add: number): void {
        this.power += add;
        console.log("power = " + this.power);
    }

    //加血    
    AddHP(): void {
        if (this.hp < 10) this.hp++;
        GameMain.gameInfo.SetHP(this.hp);
    }
    //掉血
    lostHP(): void {

        if (this.hp > 0) {
            this.hp--;
            //这里开始变色
            this.ChangeColor();

        }
        //减少火力
        if (this.fireLevel > 1) this.fireLevel--;

        GameMain.gameInfo.SetHP(this.hp);
    }

    ChangeColor(): void {
        var redMat: number[] =
            [
                1, 0, 0, 0, 0, //R
                0, 0, 0, 0, 0, //G
                0, 0, 0, 0, 0, //B
                0, 0, 0, 1, 0, //A
            ];
        var redFilter: Laya.ColorFilter = new Laya.ColorFilter(redMat);
        this.filters = [redFilter];
        this.timerOnce(100, this, () => {
            // this.filters = null;
            changeUnitMode(this.mode, this);
        });
    }

    changeMode(): void {
        this.mode = this.mode * -1;
        changeUnitMode(this.mode, this);
    }

    onComplete(): void {

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

    }
}