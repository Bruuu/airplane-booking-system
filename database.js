const fs = require('fs');
const {Reservation} = require('./reservation.js');

class Database {
    path;
    reservations;
    
    constructor(path) {
        this.path = path;
        if (fs.existsSync(this.path)) {
            let fileContent = fs.readFileSync(this.path);
            this.reservations = JSON.parse(fileContent).map((reservation) => new Reservation(reservation));
        } else {
            this.reservations = [];
        }
    }
    addReservation(reservation) {
        this.reservations = [...this.reservations, reservation];
    }
    checkReservation(row, seat) {
        return this.reservations.find((reservation) => reservation.row == row && reservation.seat === seat);
    }
    passengerDetails(row, seat) {
        return this.reservations.find((reservation) => reservation.row == row && reservation.seat === seat);
    }
    save() {
        fs.writeFileSync(this.path, JSON.stringify(this.reservations), function(err){ console.log(err); });
    }
}
exports.Database = Database