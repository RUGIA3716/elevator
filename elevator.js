class Elevator {
    constructor() {
        // 止まるフロアを指定する 0 -> n
        this.relation_floor = [];
        this.relation_floor_length = 0;
        this.active = false;
        // これはフロア側、ボタンを押す側で管理するといいかも
        this.timer = setInterval(this.run, 1000);
        this.now_floor = 0;
    }
    add_floor(floor) {
        for (let i = 0; i < this.relation_floor_length; ++i) {
            if (this.relation_floor[i].floor > floor.floor) {
                this.relation_floor.splice(i, 0, floor);
                ++this.relation_floor_length;
                return;
            }
        }
        this.relation_floor.push(floor);
        // 一番最初に追加された階層に自動的に配置する
        if (this.relation_floor_length == 0) {
            this.now_floor = floor;
        }
        ++this.relation_floor_length;
        return;
    }
    run() {
        if (!this.active) {
            console.log('not active');
            return;
        }
        console.log('active');
        // floor の up_butotn, down_butotn が押されたときにelevatorにイベントをひっかけて向かう

    }
}