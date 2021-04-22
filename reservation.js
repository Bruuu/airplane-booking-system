class Reservation {
    row;
    seat;
    firstName;
    lastName;
    passport;

    constructor(data) {
      Object.assign(this, data);
    }

    seatClass() {
        if (parseInt(this.row, 10) < 6) {
            return 'B';
        } else {
            return 'E';
        }
    }
};
exports.Reservation = Reservation