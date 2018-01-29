
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class GameInfoUI extends View {
		public btn_logo:Laya.Image;
		public btn_top:Laya.Box;
		public lbl_hp:Laya.Label;
		public lbl_score:Laya.Label;
		public btn_start:Laya.Button;
		public btn_boom:Laya.Box;
		public lbl_boomCount:Laya.Label;
		public btn_mode:Laya.Button;
		public powerBar:Laya.ProgressBar;

        public static  uiView:any ={"type":"View","props":{"width":720,"height":1280},"child":[{"type":"Image","props":{"y":250,"x":140,"width":444,"var":"btn_logo","skin":"gameUI/logo.png","height":225}},{"type":"Box","props":{"y":3,"x":18,"width":691,"visible":false,"var":"btn_top","height":130},"child":[{"type":"Label","props":{"y":40,"x":2,"width":118,"text":"血量：","height":71,"fontSize":48,"color":"#000000","bold":true,"align":"center"}},{"type":"Label","props":{"y":40,"x":126,"width":58,"var":"lbl_hp","text":"0","height":71,"fontSize":48,"color":"#09f856","bold":true,"align":"left"}},{"type":"Label","props":{"y":42,"x":516,"width":135,"var":"lbl_score","text":"0","height":59,"fontSize":48,"color":"#ffa300","bold":true,"align":"left"}},{"type":"Label","props":{"y":40,"x":391,"width":118,"text":"积分：","height":71,"fontSize":48,"color":"#000000","bold":true,"align":"center"}}]},{"type":"Button","props":{"y":600,"x":122,"width":490,"var":"btn_start","stateNum":1,"skin":"gameUI/start.png","height":178}},{"type":"Box","props":{"y":924,"x":0,"width":147,"visible":false,"var":"btn_boom","height":74},"child":[{"type":"Label","props":{"y":30,"x":102,"width":36,"var":"lbl_boomCount","text":"×3","height":35,"fontSize":26,"color":"#ff0400"}},{"type":"Image","props":{"y":10,"x":20,"width":80,"skin":"gameRole/ufo_boom.png","height":60}}]},{"type":"Button","props":{"y":1097,"x":82,"width":120,"visible":true,"var":"btn_mode","stateNum":2,"skin":"gameUI/btn_bg.png","name":"变身","height":47}},{"type":"ProgressBar","props":{"y":1104,"x":538,"width":120,"visible":true,"var":"powerBar","value":0,"skin":"comp/progress.png","height":40}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.GameInfoUI.uiView);

        }

    }
}
