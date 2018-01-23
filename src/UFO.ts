/*
* name;
*/
class UFO extends Laya.Sprite {
    constructor() {
        super();


    }

    public speed: number = 1;
    public hitRadius: number = 100;  //自己的半径
    //是火力加强   2是加炸弹道具   3是医药包    
    public type: number = 0;


    init(x: number = 0, y: number = 0): void {

        //随机类型        
        this.type = Math.random() < 0.5 ? 1 : Math.random() < 0.5 ? 2 : 3;
        this.loadImage("gameRole/ufo" + this.type + ".png");

        //设置轴心点
        this.pivot(this.getBounds().width / 2, this.getBounds().height / 2);

        this.pos(x, y);
        if (x <= 0 || y <= 0) {
            this.y = -100;
            this.x = Math.random() * (Laya.stage.width - 30);
        }


        //移动
        this.frameLoop(1, this, this.onMove);


        this.frameLoop(1, this, this.onMove);

        //添加到 道具列表        
        GameMain.ufo.addChild(this);

    }

    onMove(): void {

        this.y += this.speed;
        //判断是否超过屏幕
        if (this.x < -100 || this.x > Laya.stage.width + 100 || this.y < -100 || this.y > Laya.stage.height + 100) {

            this.recover();

        }
    }

    EatUFO(): void {

        if (this.type == 1) {
            //加火力
            GameMain.hero.fireLevel++;
        }
        else if (this.type == 2) {
            //加一个炸弹
            GameMain.gameInfo.SetBoomCount(++GameMain.hero.boomCount);
        }
        else if (this.type == 3) {
            //加血
            GameMain.hero.AddHP();

        }

        //播放音效 回收自己        
        Laya.SoundManager.playSound("res/sound/achievement.mp3");
        this.recover();

    }

    recover(): void {
        this.graphics.clear();
        this.timer.clear(this, this.onMove);
        this.removeSelf();
        Laya.Pool.recover("ufo", this);
    }

}