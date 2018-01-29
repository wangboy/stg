/*
* name;
*/
class Enemy extends Laya.Animation {
    public type: number;    //1小飞机   2中飞机    3大飞机
    public speeds: number[] = [5, 3, 1];
    public bulletSpeed: number = 8;
    public radius: number[] = [25, 35, 75];
    public hps: number[] = [1, 3, 15];
    public hp: number = 0;

    public fireInterval: number[] = [1000, 1500, 3000]; //飞机子弹发射间隔

    private mode: number = 1; //1:white -1:black
    // public hitRadius: number = 0;

    constructor() {
        super();
    }


    init(type: number): void {

        this.type = type;
        this.y = -100;
        this.x = Math.random() * Laya.stage.width;

        this.mode = Math.random() > 0.5 ? 1 : -1;

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
    }

    playAction(action: string): void {

        this.play(0, true, "enemy" + this.type + "_" + action);
    }



    lostHP(value: number): void {
        if (this.hp > 0) {
            this.hp -= value;
            if (this.hp < 0) this.hp = 0;
            this.playAction("hit");
        }
    }

    onComplete(): void {


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
                var score: number = this.hps[this.type - 1] * (GameMain.hero.fireLevel + 1);
                GameMain.hero.score += score;
                GameMain.gameInfo.SetScore(GameMain.hero.score);

            }




            //回收自己            
            this.recover();

        }
        else {
            this.playAction("fly");
        }

    }

    FireBullet(): void {


        //无论什么等级， 先发射一个直线导弹先
        var b: Bullet = Laya.Pool.getItemByClass("bullet", Bullet);
        b.init(1, 0, -this.bulletSpeed, 2, this.mode);
        b.pos(this.x, this.y);
        Laya.stage.addChild(b);

        //如果是小飞机 先瞄准一下        
        if (this.type == 1 && GameMain.hero != null) {
            b.rota = Move.GetRotation(b, GameMain.hero.x, GameMain.hero.y);
            b.speed = this.bulletSpeed;
        }

        //子弹夹角
        var tRota: number = 5;

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
    }


    onMove(): void {

        this.y += this.speeds[this.type - 1];
        if (this.y >= Laya.stage.height + 200) {

            this.recover();
        }
    }

    recover(): void {
        this.clear();

        this.y = -100;//为了不被跟踪弹 追踪
        this.timer.clear(this, this.onMove);
        this.removeSelf();
        this.off(Laya.Event.COMPLETE, this, this.onComplete);
        Laya.Pool.recover("enemy", this);

    }
}