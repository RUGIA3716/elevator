'use strict'
class Floor {
    #up_floor;
    #down_floor;
    #up_button;
    #down_button;
    constructor({ floor, upfloor, downfloor, elevator_manager }) {
        // 秘匿
        this.#up_floor = typeof upfloor == 'undefined' ? 0 : upfloor;
        this.#down_floor = typeof downfloor == 'undefined' ? 0 : downfloor;

        this.floor = floor;
        this.up_passangers = [];
        this.down_passangers = [];
        this.relese_passangers = [];
        // エレベーターマネージャーを呼び出す
        this.elevator_manager = elevator_manager;

        this.#up_button = false;
        this.#down_button = false;

        this.active = true;
        this.timer = setTimeout(() => { this.run(); }, 1000);
    }
    // floor型を設定する
    set_upfloor(floor) {
        this.#up_floor = floor;
    }
    set_downfloor(floor) {
        this.#down_floor = floor;
    }
    get_top_floor() {
        if (this.#up_floor == 0) {
            return this.floor;
        }
        return this.#up_floor.get_top_floor();
    }
    get_bottom_floor() {
        if (this.#down_floor == 0) {
            return this.floor;
        }
        return this.#down_floor.get_bottom_floor();
    }
    createPassanger() {
        if (Math.random() * 100 - 99 > 0) {
            // console.log('乗客を生成します。');
            let p = new Passanger({ top_floor: this.get_top_floor(), bottom_floor: this.get_bottom_floor(), now_floor: this.floor });
            // console.table(p);
            if (p.direction == 1) {
                if(this.up_passangers.length > 10){
                    return;
                }
                // console.log('上方向に追記します。 : ' + this.floor);
                this.up_passangers.push(p);
                this.#push_up_button();
            }
            else {
                if(this.down_passangers.length > 10){
                    return;
                }
                // console.log('下方向に追記します。 : ' + this.floor);
                this.down_passangers.push(p);
                this.#push_down_button();
            }
        }
    }
    #push_up_button() {
        if (this.#up_button) {
            return false;
        }
        console.log(this.floor + '階で上ボタンが押されました');
        this.#up_button = true;
        // ボタンを押したときにエレベーターをアクティブにする
        this.elevator_manager.run(this.floor, 1);
    }
    #push_down_button() {
        if (this.#down_button) {
            return false;
        }
        console.log(this.floor + '階で下ボタンが押されました');
        this.#down_button = true;
        this.elevator_manager.run(this.floor, -1);
    }

    turn_off_up_button() {
        this.#up_button = false;
    }
    turn_off_down_button() {
        this.#down_button = false;
    }

    get_up_button() {
        return this.#up_button == true ? true : false;
    }
    get_down_button() {
        return this.#down_button == true ? true : false;
    }
    set_relese_passanger(relese_passangers){
        relese_passangers = [].concat(relese_passangers);
        for(let i = 0; i < relese_passangers.length; ++i){
            this.relese_passangers.push({name: relese_passangers.name, hope: relese_passangers.name, relese_date: new Date()});
        }
    }
    delete_relese_passanger(){
        for(let i = 0; i < this.relese_passangers.length; ++i){
            if(this.relese_passangers[i].relese_date.getTime() + 1000 < new Date().getTime() ){
                this.relese_passangers.splice(i, 1);
                --i;
            }
            else{
            }
        }
    }


    get_up_passanger() {
        if (this.up_passangers.length == 0) {
            return [];
        }
        if (this.up_passangers.length == 1) {
            return [this.up_passangers.shift()];
        }
        let buffer = [];
        let passanger_num = this.up_passangers.length;
        for(let i = 0; i < passanger_num; ++i){
            buffer.push(this.up_passangers.shift());
        }
        console.log();
        return buffer;
    }
    get_down_passanger() {
        if (this.down_passangers.length == 0) {
            return [];
        }
        if (this.down_passangers.length == 1) {
            return [this.down_passangers.shift()];
        }
        let buffer = [];
        let passanger_num = this.down_passangers.length;
        for(let i = 0; i < passanger_num; ++i){
            buffer.push(this.down_passangers.shift());
        }
        return buffer;

    }

    run() {
        if (!this.active) {
            console.log('floor is not active. stop generating.');
            return;
        }
        this.createPassanger();
        // console.log('floor is active. keep generating.');
        // floor の up_butotn, down_butotn が押されたときにelevatorにイベントをひっかけて向かう

        this.delete_relese_passanger();

        setTimeout(() => { this.run(); }, 100);
    }
}