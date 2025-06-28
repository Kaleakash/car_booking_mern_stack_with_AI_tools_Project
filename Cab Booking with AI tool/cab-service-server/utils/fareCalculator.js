const moment = require('moment');

function calculateFare({ 
    rentPerHour, 
    totalHours, 
    bookingStart, 
    bookingEnd, 
    surgeMultiplier = 1, 
    nightCharge = 0, 
    discount = 0 
}) {
    let baseFare = rentPerHour * totalHours;

    // Surge pricing (e.g., peak hours 7-10am, 5-9pm)
    if (surgeMultiplier > 1) {
        baseFare *= surgeMultiplier;
    }

    // Night charges (e.g., 10pm-6am)
    const startHour = moment(bookingStart).hour();
    const endHour = moment(bookingEnd).hour();
    if ((startHour >= 22 || startHour < 6) || (endHour >= 22 || endHour < 6)) {
        baseFare += nightCharge * totalHours;
    }

    // Apply discount (percentage)
    if (discount > 0) {
        baseFare = baseFare * (1 - discount / 100);
    }

    return Math.round(baseFare);
}

module.exports = calculateFare;