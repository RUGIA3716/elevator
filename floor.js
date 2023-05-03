class floor {
    constructor(floor, upfloor, downfloor) {
        this.floor = floor;
        if (typeof upfloor == 'undefined') {
            this.upfloor = 0;
        }
        else {
            this.upfloor = upfloor;
        }
        if (typeof downfloor == 'undefined') {
            this.downfloor = 0;
        }
        else {
            this.downfloor = downfloor;
        }
        this.downfloor = 0;
        this.passanger = [];
        // 止まっているエレベーターを格納する
        this.elevator = [];

        this.up_button = false;
        this.down_button = false;
        this.up_elevator = [];
        this.down_elevator = [];
    }
    // floor型を設定する
    set_upfloor(floor) {
        this.upfloor = floor;
    }
    set_downfloor(floor) {
        this.downfloor = floor;
    }
    createPassanger() {

    }
    getPassanger() {

    }

}