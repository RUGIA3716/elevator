'use strict'
class Elevator_Manager {
    constructor({ elevator_num = 0 }) {
        this.elevator = [];
        // 止まるフロアを指定する 0 -> n
        this.relation_floor = [];
        this.relation_floor_length = 0;
        this.elevator_num = elevator_num;
        this.stack_button = [];
        for (let i = 0; i < elevator_num; ++i) {
            this.elevator[i] = new Elevator({ stack_button: this.stack_button, relation_floor: this.relation_floor });
        }
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
            for (let i = 0; i < this.elevator_num; ++i) {
                this.elevator[i].now_floor = floor;
            }
        }
        ++this.relation_floor_length;
        return;
    }
    run(floor_num, direction) {
        for (let i = 0; i < this.elevator.length; ++i) {
            if (this.elevator[i].active == false) {
                this.elevator[i].active = true;
                console.log('すぐにエレベーターを呼び出します。');
                this.add_stack_button(floor_num, direction);
                this.elevator[i].run();
                // すぐに実行した場合
                return true;
            }
        }
        // 待機する場合
        console.log('エレベーターは稼働中です。お待ちください。');
        this.add_stack_button(floor_num, direction);
        return false;
    }
    add_stack_button(floor_num, direction) {
        for (let i = 0; i < this.stack_button.length; ++i) {
            if (this.stack_button[i].floor_num == floor_num && this.stack_button[i].direction == direction) {
                return;
            }
        }
        this.stack_button.push({ 'floor_num': floor_num, 'direction': direction });
    }

}
class Elevator {
    constructor({ stack_button, relation_floor }) {
        this.active = false;
        // フロア側から読み込まれる。
        // this.timer = setInterval(this.run, 1000);
        this.now_floor = 0;
        this.status = 0;

        this.target_floor = 0;
        this.final_direction = 0;
        this.temp_direction = 0;

        this.passangers = [];

        // 呼び出しのスタックリストを呼び出せるように
        this.stack_button = stack_button;
        this.relation_floor = relation_floor;
    }

    run() {
        if (!this.active) {
            console.log('elevator is not active.\n power off.');
            return;
        }
        console.log('elevator is active. keep working.');
        // 停止中であること。
        if (this.status == 0) {
            // 行き先の階層を探索する。
            let stack_button = this.stack_button.shift();
            this.target_floor = stack_button.floor_num;
            this.final_direction = stack_button.direction;
            if(this.now_floor > stack_button.floor_num){
                this.temp_direction = 1;
            }
            else if(this.now_floor < stack_button.floor_num){
                this.temp_direction = -1;
            }
            else{
                // 同じ階の場合は一時的な方向も押されたボタンの方向に指定する。
                this.temp_direction = stack_button.direction;
            }

            console.log('稼働を開始します。 対象は ' + stack_button.floor_num + '、 方向は ' + this.final_direction + ' です。');
            console.log('現在このエレベーターは' + this.now_floor.floor + '階に止まっています。 目標の ' + stack_button.floor_num + '階へ移動します。');


            this.now_floor = stack_button.floor_num;
            this.status = 1;
        }
        // 行き先までの移動中であること
        else if (this.status == 1) {
            // 目標階へ到達した
            if (this.now_floor == this.target_floor) {
                console.log('目標階へ到達しました。');
                this.status = 0;
                this.turn_off_button();

                // 方向を目標方向へ統一する。
                this.temp_direction = this.final_direction;

                this.status = 3;

                this.get_passanger();




                this.active = false;
            }
            else {
                console.log('移動中です。');
            }
        }
        setTimeout(() => { this.run(); }, 100);
    }
    turn_off_button() {
        for (let i = 0; i < this.relation_floor.length; ++i) {
            if (this.relation_floor[i].floor == this.target_floor) {
                if (this.direction = 1) {
                    this.relation_floor[i].turn_off_up_button();
                }
                else {
                    this.relation_floor[i].turn_off_down_button();

                }
                return;
            }
        }
    }
    get_passanger(){
        console.log('乗客を迎え入れます。');
        for (let i = 0; i < this.relation_floor.length; ++i) {
            if (this.relation_floor[i].floor == this.target_floor) {
                if (this.direction = 1) {
                    this.passangers.push(this.relation_floor[i].get_up_passanger());
                }
                else {
                    this.passangers.push(this.relation_floor[i].get_down_passanger());
                }
                return;
            }
        }
    }
}