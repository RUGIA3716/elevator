'use strict'
class Building {
    /**
     * ビル名　一番下の階　一番上の階　エレベーターの数 
     */
    constructor({name, bottom_floor, top_floor, ele_num}) {
        if (top_floor < bottom_floor) {
            // 入れ替えて実行してもよいが現時点では設定を厳しくする
            console.log('ビルの階層が正しくありません。\n上層階が下層階よりも上に来るようにデータを指定してください。');
            return;
        }
        this.name = name;
        this.bottom_floor = bottom_floor;
        this.top_floor = top_floor;
        this.elevator_num = ele_num;
        this.floor_length = top_floor - bottom_floor + 1;

        this.floor = [];
        this.elevator_manager;

        // エレベーターを作る
        this.create_elevator();

        // フロアを作る
        this.create_floor();

        // 作成したフロアをエレベーターへ反映する
        this.elevator_bind_floor();

    }
    // フロアを作る
    create_floor() {
        // 一番下から一番上までフロアを作成する
        for (let i = 0; i < this.floor_length; ++i) {
            let new_floor = new Floor({floor: this.bottom_floor + i, elevator_manager: this.elevator_manager});
            if (i > 0) {
                new_floor.set_downfloor(this.floor[i - 1]);
            }
            this.floor[i] = new_floor;
            if (i > 0) {
                this.floor[i - 1].set_upfloor(new_floor);
            }
        }
    }
    // エレベーターを作る
    create_elevator() {
        this.elevator_manager = new Elevator_Manager({elevator_num: this.elevator_num});
    }
    elevator_bind_floor(){
        for (let j = 0; j < this.floor_length; ++j) {
            this.elevator_manager.add_floor(this.floor[j]);
        }
    }

    
}