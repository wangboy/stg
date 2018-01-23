/*
* name;
*/
class BackGround extends Laya.Sprite {


    private bg1: Laya.Sprite;
    private bg2: Laya.Sprite;


    constructor() {
        super();

        this.init();
    }


    init(): void {
        this.bg1 = new Laya.Sprite();
        this.bg1.loadImage("war/background.png");
        this.addChild(this.bg1);

        this.bg2 = new Laya.Sprite();
        this.bg2.loadImage("war/background.png");
        this.bg2.y = -Laya.stage.height;
        this.addChild(this.bg2);

        Laya.stage.frameLoop(1, this, this.onLoop);
    }

    onLoop(): void {
        this.bg1.y++;
        this.bg2.y++;

        if (this.bg1.y > Laya.stage.height) {
            this.bg1.y = -Laya.stage.height + 1;
        } else if (this.bg2.y > Laya.stage.height) {
            this.bg2.y = -Laya.stage.height + 1;
        }

    }
}