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
                this.elevator[i].now_floor = floor.floor;
            }
        }
        ++this.relation_floor_length;
        return;
    }
    run(floor_num, direction) {
        for (let i = 0; i < this.elevator.length; ++i) {
            if (this.elevator[i].active == false) {
                this.elevator[i].active = true;
                console.log('すぐにエレベーターを呼び出します。\n現在のスタックリスト');
                this.add_stack_button(floor_num, direction);
                console.table(this.stack_button);
                this.elevator[i].run();
                // すぐに実行した場合
                return true;
            }
        }
        // 待機する場合
        console.log('エレベーターは稼働中です。お待ちください。\n現在のスタックリスト');
        this.add_stack_button(floor_num, direction);
        console.table(this.stack_button);
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

        this.final_target_floor = 0;
        this.temp_target_floor = 0;
        this.final_direction = 0;
        this.temp_direction = 0;

        this.passangers = [];
        // いったん定員は無視する。
        this.capacity = 99999;

        this.target_floors = [];
        this.available_stop_floors = [];

        // 呼び出しのスタックリストを呼び出せるように
        this.stack_button = stack_button;
        this.relation_floor = relation_floor;
    }

    run() {
        if (!this.active) {
            console.log('elevator is not active.\n power off.');
            return;
        }
        console.log('elevator is active. keep working. status : ' + this.status);
        this.work();
        if (this.stack_button.length == 0 && this.status == 0) {
            this.active = false;
        }
        setTimeout(() => { this.run(); }, 500);
    }
    work() {
        // 停止中であること。
        if (this.status == 0) {
            // 行き先の階層を探索する。
            let stack_button = this.stack_button.shift();
            // 最終行先と一時行先を格納する。
            this.final_target_floor = stack_button.floor_num;
            this.temp_target_floor = this.final_target_floor;

            this.final_direction = stack_button.direction;

            // this.now_floor = stack_button.floor_num;
            this.status = 1;

            if (this.now_floor < stack_button.floor_num) {
                this.temp_direction = 1;
            }
            else if (this.now_floor > stack_button.floor_num) {
                this.temp_direction = -1;
            }
            else {
                // 同じ階の場合は一時的な方向も押されたボタンの方向に指定する。
                this.temp_direction = stack_button.direction;
                console.log('現在このエレベーターは' + this.now_floor + '階に止まっています。 目標の ' + stack_button.floor_num + '階と同じ階です。');
                return;
            }
            console.log('現在このエレベーターは' + this.now_floor + '階に止まっています。 目標の ' + stack_button.floor_num + '階(' + (this.temp_direction == 1 ? '上' : '下') + ')へ移動します。');


        }
        // 行き先までの移動中であること
        else if (this.status == 1) {
            // 目標階へ到達した
            if (this.now_floor == this.final_target_floor) {
                console.log('目標階へ到達しました。');
                this.status = 2;
                if (this.temp_direction != this.final_direction) {
                    console.log('行先方向を変更します。 ' + (this.temp_direction == 1 ? '上' : '下') + ' から ' + (this.final_direction == 1 ? '上' : '下') + ' へ変更します。');
                }
                else {
                    console.log('行先方向は継続して ' + (this.final_direction == 1 ? '上' : '下') + 'です。');
                }
                // 方向を目標方向へ統一する。
                this.temp_direction = this.final_direction;
                console.log('現在の行先方向は ' + (this.temp_direction == 1 ? '上' : '下') + ' です');
                this.turn_off_button();
            }
            else {
                console.log('移動中です。');



                console.log('目的の' + this.temp_target_floor + '階を目指し動きます。');
                if (this.temp_direction == 1) {
                    console.log(' \t ' + this.now_floor + '階 -> ' + (this.now_floor + 1) + '階');
                    if (this.now_floor + 1 > this.relation_floor[0].get_top_floor()) {
                        console.log('エレベーターは存在しない階に行こうとしています。');
                        this.error_stop();
                    }
                    this.now_floor += 1;
                }
                else {
                    console.log(' \t ' + this.now_floor + '階 -> ' + (this.now_floor - 1) + '階');
                    if (this.now_floor - 1 < this.relation_floor[0].get_bottom_floor()) {
                        console.log('エレベーターは存在しない階に行こうとしています。');
                        this.error_stop();
                    }
                    this.now_floor -= 1;
                }



            }
        }
        else if (this.status == 2) {
            // 乗客を取得
            this.get_passanger();

            // 乗客の行先階をソートする
            console.log('行先階をソートして表示します。');
            this.sort_passangers_hope();
            console.log(this.target_floors);

            // 本来乗客がいるはずだが一人もいなかった場合に動作を停止する
            if (this.passangers.length == 0) {
                console.log('乗客がいませんでした。動作を停止します。');
                this.status = 0;
                this.active = false;
                return;
            }
            // 乗客を乗せた後は目標に向かって移動を行う。途中で同じ方向に向かう乗客がいる場合は拾う
            this.status = 3;

            // 最終行先を更新
            this.final_target_floor = this.target_floors[this.target_floors.length - 1];
            // 途中の行先を更新
            this.temp_target_floor = this.target_floors.shift();

        }
        else if (this.status == 3) {
            console.log('乗客を乗せたため移動を開始します。\n現在乗客は' + this.passangers.length + '人です。');
            console.table(this.passangers);

            // 止まれる階層をリストアップ
            // -> 止まれる階層でボタンを押されたら場合は止まる予定のリストに追加を行う。F
            // 途中の行先よりも手前の場合は更新を行う
            // 毎ターン更新を行う。
            this.set_available_stop_floors();
            // 止まることができる対象を、次の停止予定の場所まで探索する
            this.search_stop_list();

            // 一つ上の階に移動する。
            // ここはそのままtemp_directionを足してもよいが今後変更するため。
            console.log('目的の' + this.temp_target_floor + '階を目指し動きます。');
            if (this.temp_direction == 1) {
                console.log(' \t ' + this.now_floor + '階 -> ' + (this.now_floor + 1) + '階');
                if (this.now_floor + 1 > this.relation_floor[0].get_top_floor()) {
                    console.log('エレベーターは存在しない階に行こうとしています。');
                    this.error_stop();
                }
                this.now_floor += 1;
            }
            else {
                console.log(' \t ' + this.now_floor + '階 -> ' + (this.now_floor - 1) + '階');
                if (this.now_floor - 1 < this.relation_floor[0].get_bottom_floor()) {
                    console.log('エレベーターは存在しない階に行こうとしています。');
                    this.error_stop();
                }
                this.now_floor -= 1;
            }

            // 止まる対象の階になった場合
            if (this.now_floor == this.temp_target_floor) {
                console.log('目的の' + this.temp_target_floor + '階に到着しました。');
                this.status = 4;
            }
            else {
                // 継続
            }
        }
        else if (this.status == 4) {
            console.log('乗客の乗り降りを行うため停車します。\n現在乗客は' + this.passangers.length + '人です。');
            console.table(this.passangers);
            // 乗客をリリース
            this.relese_passangers();

            // 乗客を取得
            this.get_passanger();

            // 乗客の行先階をソートする
            this.sort_passangers_hope();
            console.log(this.target_floors);


            console.log('行先階をソートし表示します。');
            console.log(this.target_floors);

            // 本来乗客がいるはずだが一人もいなかった場合に動作を停止する
            if (this.passangers.length == 0) {
                console.log('乗客がいませんでした。動作を停止します。');
                console.log(this.now_floor + '階にて停止します。');
                this.status = 0;
                this.passangers = [];
                this.final_target_floor = 0;
                this.temp_target_floor = 0;
                this.final_direction = 0;
                this.temp_direction = 0;
                this.available_stop_floors = [];

                // this.active = false;

                return;
            }
            // 乗客を乗せた後は目標に向かって移動を行う。途中で同じ方向に向かう乗客がいる場合は拾う
            this.status = 3;

            // 最終行先を更新
            this.final_target_floor = this.target_floors[this.target_floors.length - 1];
            // 途中の行先を更新
            this.temp_target_floor = this.target_floors.shift();

            if (this.final_target_floor == this.now_floor) {
                // 乗客をすべて削除
                console.log('最終目的階に到着しました。');
                console.log('乗客を消去します。');
                this.status = 0;
                this.passangers = [];
                this.final_target_floor = 0;
                this.temp_target_floor = 0;
                this.final_direction = 0;
                this.temp_direction = 0;
                this.available_stop_floors = [];
            }
        }
    }
    turn_off_button() {
        for (let i = 0; i < this.relation_floor.length; ++i) {
            if (this.relation_floor[i].floor == this.final_target_floor) {
                if (this.final_direction == 1) {
                    this.relation_floor[i].turn_off_up_button();
                }
                else {
                    this.relation_floor[i].turn_off_down_button();
                }
                return;
            }
        }
    }
    get_passanger() {
        console.log('乗客を迎え入れます。');
        for (let i = 0; i < this.relation_floor.length; ++i) {
            if (this.relation_floor[i].floor == this.now_floor) {
                if (this.final_direction == 1) {
                    let passangers = this.relation_floor[i].get_up_passanger();
                    console.table(passangers);
                    console.log('↑上へ向かう乗客を取得します。');
                    passangers.length == 0 ? false : this.passangers = this.passangers.concat(passangers)
                }
                else {
                    let passangers = this.relation_floor[i].get_down_passanger();
                    console.table(passangers);
                    console.log('↓下へ向かう乗客を取得します。');
                    passangers.length == 0 ? false : this.passangers = this.passangers.concat(passangers)
                }
                // console.table(this.passangers);
                return;
            }
        }
    }
    sort_passangers_hope() {
        for (let i = 0; i < this.passangers.length; ++i) {
            this.add_target_floor(this.passangers[i].hope_floor)
        }
    }
    relese_passangers() {
        console.log('乗客を降ろします。');
        let counter = 0;
        let buffer = []
        for (let i = 0; i < this.passangers.length; ++i) {
            if (this.passangers[i].hope_floor == this.now_floor) {
                buffer.push(this.passangers.splice(i, 1));
                --i;
                ++counter;
            }
        }
        console.log(' -> ' + counter + '人を降ろしました。');
        for (let i = 0; i < this.relation_floor.length; ++i) {
            if (this.relation_floor[i].floor == this.now_floor) {
                this.relation_floor[i].set_relese_passanger(buffer);
            }
        }
    }
    relese_force_passangers() {
        console.log('乗客を降ろします。');
        let counter = 0;
        for (let i = 0; i < this.passangers.length; ++i) {
            this.passangers.splice(i, 1);
            --i;
            ++counter;
        }
        console.log(' -> ' + counter + '人を降ろしました。');
    }


    add_target_floor(floor_num) {
        // 方向によって一番目を変更する
        for (let i = 0; i < this.target_floors; ++i) {
            if (this.final_direction == 1) {
                // 上に向かうので、現在より下の階へは行くことができない
                if (floor_num <= this.now_floor) {
                    console.log('乗客は行先階のないエレベーターに乗ってしまいました。');
                    continue;
                }
                if (floor_num < this.target_floors[i]) {
                    this.target_floors.splice(i, 0, floor_num);
                    return;
                }
            }
            else {
                // 下に向かうので、現在より上の階へは行くことができない
                if (floor_num >= this.now_floor) {
                    console.log('乗客は行先階のないエレベーターに乗ってしまいました。');
                    continue;
                }
                if (floor_num > this.target_floors[i]) {
                    this.target_floors.splice(i, 0, floor_num);
                }
            }
            // 上り下りともに同じ処理 - 追加済み
            if (floor_num == this.target_floors[i]) {
                return;
            }
        }
        // 上り下りともに同じ処理 - 一番目は必ず追加する
        this.target_floors.push(floor_num);
    }
    // できるだけ更新処理があるたびに止まれるフロアを更新する
    set_available_stop_floors() {
        // 上に向かうなら上に近いところをとったほうがいいかと思ったが今回はスタック形式にするため無効
        // また、最短距離と時間ごとで区切るのもいいかもしれない。
        // this.relation_floor[0].get_top_floor();
        console.log('止まれる階層を生成します。');
        console.log('現在のエレベーターの位置 : ' + this.now_floor + '階');
        console.log('現在のエレベーターの目標 : ' + this.final_target_floor + '階');
        console.log('現在のエレベーターの方向 : ' + this.final_direction);
        if (this.available_stop_floors.length == 0) {
            console.log('止まれる階層が一つも存在しないため一から生成します。');
            this.available_stop_floors = [];
            for (let i = this.now_floor; i < this.final_target_floor; ++i) {
                if (this.final_direction == 1) {
                    this.available_stop_floors.push(i + 1);
                }
                else {
                    this.available_stop_floors.push(i - 1);
                }
            }
            console.log('生成した結果を表示します。');
            console.table(this.available_stop_floors);
        }
        // 止まる予定の最上階のデータが入っていない場合に更新を行う
        let stop_top_floor = this.available_stop_floors[this.available_stop_floors.length - 1];
        if (stop_top_floor < this.final_target_floor) {
            for (let i = stop_top_floor; i < this.final_target_floor; ++i) {
                if (this.final_direction == 1) {
                    this.available_stop_floors.push(i + 1);
                }
                else {
                    this.available_stop_floors.push(i - 1);
                }
            }
        }
        console.log('止まれる階層の全リスト');
        console.table(this.available_stop_floors);
        // console.log('止まれる階層のリスト生成');
        // console.log(this.available_stop_floors);
        // 一番近い止まれる階を求める
        let bottom_stop_floor = this.now_floor + 1;
        let top_stop_floor = this.now_floor - 1;
        for (let i = 0; i < this.available_stop_floors.length; ++i) {
            if (this.final_direction == 1) {
                if (bottom_stop_floor < this.available_stop_floors[i]) {
                    // 一番近い止まれる階よりも低い場合は削除を行う
                    this.available_stop_floors.shift();
                }
                else {
                    break;
                }
            }
            else {
                if (top_stop_floor > this.available_stop_floors[i]) {
                    // 一番近い止まれる階よりも高い場合は削除を行う
                    this.available_stop_floors.shift();
                }
                else {
                    break;
                }
            }
        }
        console.log('止まれる階層のリストの調整後');
        console.table(this.available_stop_floors);
    }
    search_stop_list() {
        for (let i = 0; i < this.available_stop_floors.length; ++i) {
            // 探索対象は現在止まる予定の場所まで
            if (this.final_direction == 1 && this.available_stop_floors[i] >= this.temp_target_floor) {
                return;
            }
            if (this.final_direction == -1 && this.available_stop_floors[i] <= this.temp_target_floor) {
                return;
            }
            let target_floor = 0;
            for (let j = 0; j < this.relation_floor.length; ++j) {
                if (this.available_stop_floors[i] == this.relation_floor[j].floor) {
                    target_floor = j;
                    break;
                }
            }
            // 次に止まる予定のところまでの探索を行う
            // ボタンが押されていればその階に止まるように変更

            if (this.final_direction == 1 && this.relation_floor[target_floor].get_up_button()) {
                console.log('目標の' + this.temp_target_floor + '階に向かう間にある' + this.available_stop_floors[i] + '階でボタンが押されました。');
                this.add_target_floor(this.temp_target_floor);
                this.temp_target_floor = this.available_stop_floors[i];
            }
            if (this.final_direction == -1 && this.relation_floor[target_floor].get_down_button()) {
                console.log('目標の' + this.temp_target_floor + '階に向かう間にある' + this.available_stop_floors[i] + '階でボタンが押されました。');
                this.add_target_floor(this.temp_target_floor);
                this.temp_target_floor = this.available_stop_floors[i];
            }

        }
    }
    error_stop() {
        alert('不具合が発生しました。');
        console.log('乗客を全員降ろします。');
        this.relese_force_passangers();
        this.status = 0;
        this.passangers = [];
        this.final_target_floor = 0;
        this.temp_target_floor = 0;
        this.final_direction = 0;
        this.temp_direction = 0;
        this.available_stop_floors = [];
    }
}