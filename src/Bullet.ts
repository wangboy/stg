class Bullet extends Laya.Sprite {
    public type: number;    //1普通子弹   2跟踪弹
    public camp: number;    //1自己   2敌人
    public rota: number = 0;    //发射角度
    public speed: number;   //速度
    public tar: Laya.Sprite;//跟踪弹目标
    public ad: number;
    public mode: number;

    constructor() {
        super();
    }

    init(type: number, rota: number, v: number, camp: number, mode: number, ad: number = 1): void {

        this.type = type;
        this.rota = rota;
        this.speed = v;
        this.camp = camp;
        if (ad == 0) ad = 1;
        this.ad = ad;

        this.loadImage("gameRole/bullet" + this.camp + ".png");
        this.timer.frameLoop(1, this, this.onMove);

        this.setMode(mode);
        //  this.tar = GameMain.enemy.getChildAt(Math.round(Math.random() * 100 % GameMain.enemy.numChildren)) as Enemy;
    }

    setMode(mode: number): void {
        this.mode = mode;
        changeUnitMode(this.mode, this);
    }

    recover(): void {
        //清除子弹移动事件
        this.timer.clear(this, this.onMove);
        this.removeSelf();
        this.graphics.clear();
        this.filters = []
        Laya.Pool.recover("bullet", this);
    }

    onMove(): void {
        //普通子弹 直线发射
        if (this.type == 1) {
            Move.MoveByRotation(this, this.speed, this.rota);
        }
        //跟踪弹 自动寻找目标
        else if (this.type == 2) {

            //如果没有目标就随机获取一个            
            if (this.tar == null) {
                this.tar = GameMain.enemy.getChildAt(Math.round(Math.random() * 100 % GameMain.enemy.numChildren)) as Enemy;

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
                var enemy: Enemy = GameMain.enemy.getChildAt(i) as Enemy;

                var hitRadius: number = 1 + enemy.radius[enemy.type - 1];
                //击中了敌机
                if (Math.abs(this.x - enemy.x) < hitRadius && Math.abs(this.y - enemy.y) < hitRadius) {
                    //回收自己
                    this.recover();

                    //敌机掉血
                    enemy.lostHP(this.ad);
                }
            }
        }
        //敌人的子弹 就判断是否击中自己
        else if (this.camp == 2 && GameMain.hero != null) {

            var hero: Hero = GameMain.hero;

            var hitRadius: number = 1 + hero.hitRadius;
            //击中了自己
            if (Math.abs(this.x - hero.x) < hitRadius && Math.abs(this.y - hero.y) < hitRadius) {
                //回收自己
                this.recover();

                if (this.mode == hero.mode) {
                    hero.addPower(1);
                    GameMain.gameInfo.powerBar.value = hero.power / POWER_MAX;
                } else {
                    //自机掉血
                    hero.lostHP();
                }
            }
        }


    }
}