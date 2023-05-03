'use strict'
class Passanger {
    #can_to_top_floor;
    #can_to_bottom_floor
    constructor({ top_floor, bottom_floor, now_floor }) {
        // 秘匿
        this.#can_to_top_floor = top_floor; // 行くことができる上限
        this.#can_to_bottom_floor = bottom_floor; // 行くことができる下限

        this.name = '';
        this.now_floor = now_floor; // 現在のフロア
        this.hope_floor = 0; // 希望のフロア
        this.direction = 0; // 方向
        this.#create_destination();
    }
    #create_destination() {
        let candidate_distination_list = [];
        for (let i = 1; i <= this.#can_to_top_floor - this.#can_to_bottom_floor + 1; ++i) {
            if (i != this.now_floor) {
                candidate_distination_list.push(i);
            }
        }
        
        // console.log('候補');
        // console.table(candidate_distination_list);

        let r = Math.floor(Math.random() * (candidate_distination_list.length));
        this.hope_floor = candidate_distination_list[r];
        this.hope_floor > this.now_floor ? this.direction = 1 : this.direction = -1;
        // console.log('now_floor : ' + this.now_floor + '   hope_floor : ' + this.hope_floor + ' >> ' + this.direction);
    }
    setfloor(set_floor) {
        // 希望階層と設定される階層が同じ場合にのみ設定を行う
        this.is_hope_floor(set_floor) ? this.now_floor = set_floor : false;
    }
    is_hope_floor(compare_floor) {
        // 希望階層と降りるかどうかを聞かれた階層が同じ場合にtrueを返す。
        return this.hope_floor == set_floor ? true : false;

    }
}