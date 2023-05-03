'use strict'
class Building {
    /**
     * ビル名　一番下の階　一番上の階　エレベーターの数 
     */
    constructor({ name, bottom_floor, top_floor, ele_num }) {
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

        this.timer = setInterval(() => { this.run(); }, 100);
    }
    // フロアを作る
    create_floor() {
        // 一番下から一番上までフロアを作成する
        for (let i = 0; i < this.floor_length; ++i) {
            let new_floor = new Floor({ floor: this.bottom_floor + i, elevator_manager: this.elevator_manager });
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
        this.elevator_manager = new Elevator_Manager({ elevator_num: this.elevator_num });
    }
    elevator_bind_floor() {
        for (let j = 0; j < this.floor_length; ++j) {
            this.elevator_manager.add_floor(this.floor[j]);
        }
    }

    run() {
        // console.log('現在の状況を出力します。');
        let el_str = '';
        let el_str2 = '';
        let el_str_now = '';
        let floor_str = [];
        let floor_str2 = '';
        let floor_str_num = [];

        for (let i = this.floor_length - 1; i >= 0; --i) {
            let uplamp = this.floor[i].get_up_button() ? '●' : '○';
            let downlamp = this.floor[i].get_down_button() ? '●' : '○';
            let up_human = this.get_human(this.floor[i], 1);
            let down_human = this.get_human(this.floor[i], -1);
            let relese_human = this.get_human(this.floor[i], 0);
            floor_str2 += this.floor[i].floor + '. ↑ ' + uplamp + ' : ' + up_human + '<br>' + '階 ↓ ' + downlamp + ' : ' + down_human + '<br> -> ' + relese_human + '<br><br>';
            floor_str_num.push(this.floor[i].floor);
        }
        for (let i = this.elevator_manager.elevator.length - 1; i >= 0; --i) {
            let elevetor_now_floor_index = 0;
            for (let j = 0; j < floor_str_num.length; ++j) {
                if (floor_str_num[j] == this.elevator_manager.elevator[i].now_floor) {
                    el_str += '<br>|' + this.el_get_human(this.elevator_manager.elevator[i], true) + '|<br><br><br>'
                }
                else {
                    el_str += '<br>  ' + this.el_get_human(this.elevator_manager.elevator[i], false) + '<br><br><br>'
                }
            }
            el_str2 += 'status : ' + this.elevator_manager.elevator[i].status + '<br>乗客人数 : ' + this.elevator_manager.elevator[i].passangers.length + '人' + '<br>';
        }
        document.getElementById('monitor1').innerHTML = el_str;
        document.getElementById('monitor2').innerHTML = floor_str2;
    }
    get_human(floor, direction) {
        let out = '';
        let human_num = direction == 1 ? floor.up_passangers.length : floor.down_passangers.length;
        if(direction == 0){
            human_num = floor.relese_passangers.length;
        }
        for (let i = 0; i < human_num; ++i) {
            out += '👤';
        }
        return out;
    }
    el_get_human(elevator, bool){
        let out = '';
        let passanger_num = elevator.passangers.length;
        for(let i = 0; i < 10; ++i){
            if(passanger_num > 0 && bool){
                out += '👤';
                --passanger_num;
            }
            else{
                if(bool == false){
                    out += ''
                }
                else{
                    out += '__';
                }
            }
        }
        return out;
    }


}