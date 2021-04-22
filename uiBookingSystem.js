const rl = require('readline-sync');
const {Database} = require('./database.js');
const {Reservation} = require('./reservation.js');
let db = new Database('FlightManifest.json');

const seatNames = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E'
}

function invalidEntry() {
    console.log("Invalid Entry! Please try again.")
};
function exit(){
    console.log("Bye!")
};
function taskSelection(){
    console.log("*******************************\n**   Welcome to AirConsole   **\n*******************************");
    console.log("Task Selection\nR: Reservation\nS: Seat Verification\nX: Exit the System");

    let task = rl.question("Please enter the task you want to perform: ");
    if (task === 'X') {
        exit();
    } else if (task === 'R') {
        seatClassSelection();
    } else if (task === 'S') {
        seatVerification();
    } 
    else {
        invalidEntry();
        taskSelection();
    }
};
function seatVerification(){
    console.log("\n*******************************\n** Seat Verification **\n*******************************");
    rowEnter(); 
}

function seatClassSelection(){
    console.log("\n*******************************\n** Seat Class **\n*******************************");
    console.log("\nSeat Class Selection:\nB: Business Class\nE: Economy Class")
    let seatClass = rl.question("Please enter the seat class you want to reserve: ");
    if ((seatClass === 'B')||(seatClass === 'E')) {
        draw(seatClass);
        rowEnter(seatClass);
    }
    else {
        invalidEntry();
        seatClassSelection();
    }
};
function draw(seatClass){
    if (!seatClass) {
        console.log(`  A B C D E`);
        for (let i = 1; i <= 8; i++) {
            process.stdout.write(`${i}`);
            for (let j = 1; j <= 5; j++) {
                let reserved = db.checkReservation(i, seatNames[j]);
                if (reserved) {
                    process.stdout.write(` X`);
                } else {
                    process.stdout.write(`  `);
                }
            }
            process.stdout.write("\n");
        }

    }
    else {
        if (seatClass === 'B') {
            console.log(`\n*******************************\n** Business Class **\n*******************************`);
            console.log(`  A B C D E`);
            for (let i = 1; i <= 5; i++) {
                process.stdout.write(`${i}`);
                for (let j = 1; j <= 5; j++) {
                    let reserved = db.checkReservation(i, seatNames[j]);
                    if (reserved) {
                        process.stdout.write(` X`);
                    } else {
                        process.stdout.write(`  `);
                    }
                }
                process.stdout.write("\n");
            }
        }
        else
        {
            console.log(`\n*******************************\n** Economy Class **\n*******************************`);
            console.log(`  A B C D E`);
            for (let i = 6; i <= 8; i++) {
                process.stdout.write(`${i}`);
                for (let j = 1; j <= 5; j++) {
                    let reserved = db.checkReservation(i, seatNames[j]);
                    if (reserved) {
                        process.stdout.write(` X`);
                    } else {
                        process.stdout.write(`  `);
                    }
                }
                process.stdout.write("\n");
            }
        }  
    }
};

function rowEnter(seatClass){
    
    let row = parseInt(rl.question("Please enter the row number: "));
    
    if (((row > 0) && (row < 9)) &&
        (
            (!seatClass) ||
            ((seatClass === 'B') && (row < 6)) ||
            ((seatClass === 'E') && (row > 5))
        )) seatEnter(seatClass, row);
  
    else {
        console.log("Try again.");
        rowEnter(seatClass);
    }
};

function seatEnter(seatClass, row){
    
    let seat = rl.question("Please enter the seat letter: ");
    if (['A','B','C','D','E'].indexOf(seat) === -1) {
        console.log("Try again.");
        seatEnter(seatClass, row);
    } else if (db.checkReservation(row, seat)) {
        if (seatClass) {
            console.log(`Sorry seat ${row}${seat} is already taken.`);
            seatEnter(seatClass, row);
        }
        passengerDetails(row, seat);
    }
    else {
            console.log(`Seat ${row}${seat} is available.`);
            if (seatClass) {
                let newBooking = new Reservation({row: row, seat: seat});
                savePassengerInfo(newBooking);
            }
            taskSelection();
    }
};
function enterPassengerInfo(field){
    let input = rl.question(`Please enter the passenger's ${field}: `).trim();
    if (input != "") return input;
    else {
        console.log(`The passenger's ${field} can not be empty. Try Again.`);
        return enterPassengerInfo(field);
    }
}

function savePassengerInfo(newBooking){
    for (const field in newBooking) {
        if (!newBooking[field])
            newBooking[field] = enterPassengerInfo(field);
    }
    db.addReservation(newBooking);
    console.log(`Seat ${newBooking.row}${newBooking.seat} was successfully booked!`);
    draw();
    taskSelection();
}
function passengerDetails(row, seat){
    const currentReservation = db.passengerDetails(row,seat);
    console.log("Passenger Details");
    console.log("FirstName: " + currentReservation.firstName);
    console.log("LastName: " + currentReservation.lastName);
    console.log("Passport Number: " + currentReservation.passport);
    rl.keyIn('Press any key to continue...');
    taskSelection();
}
exports.taskSelection = taskSelection
