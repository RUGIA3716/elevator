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

        for (let i = 0; i < this.floor.length; ++i) {
            let uplamp = this.floor[i].get_up_button() ? '○' : '●';
            let downlamp = this.floor[i].get_down_button() ? '○' : '●';
            let up_human = this.get_human(this.floor[i], 1);
            let down_human = this.get_human(this.floor[i], -1);
            floor_str.push(' ↑ ' + uplamp + ' : ' + up_human + '\n' + ' ↓ ' + downlamp + ' : ' + down_human);
            floor_str2 += ' ↑ ' + uplamp + ' : ' + up_human + '<br>' + ' ↓ ' + downlamp + ' : ' + down_human + '<br><br>';
            floor_str_num.push(this.floor[i].floor);
        }
        for (let i = 0; i < this.elevator_manager.elevator.length; ++i) {
            let elevetor_now_floor_index = 0;
            for (let j = 0; j < floor_str_num.length; ++j) {
                if (floor_str_num[j] == this.elevator_manager.elevator[i].now_floor) {
                    el_str += '| ||| |<br>| ||| |<br><br>'
                }
                else {
                    el_str += '| - - |<br>| - - |<br><br>'
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
        for (let i = 0; i < human_num; ++i) {
            out += '👤';
        }
        return out;
    }


}