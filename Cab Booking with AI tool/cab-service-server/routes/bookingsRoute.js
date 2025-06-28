const express = require("express");
const router = express.Router();
require('dotenv').config();
const Booking = require("../models/bookingModel");
const calculateFare = require('../utils/fareCalculator');
const Car = require("../models/carModel");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  process.env.API_KEY
);
router.post("/bookcar", async (req, res) => {
  const { token, rentPerHour, totalHours, bookedTimeSlots, surgeMultiplier, nightCharge, discount } = req.body;
  try {
    // Calculate fare
    const totalAmount = calculateFare({
      rentPerHour,
      totalHours,
      bookingStart: bookedTimeSlots.from,
      bookingEnd: bookedTimeSlots.to,
      surgeMultiplier,
      nightCharge,
      discount
    });

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalAmount * 100,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      req.body.transactionId = payment.source.id;
      req.body.totalAmount = totalAmount; // Save calculated amount
      const newbooking = new Booking(req.body);
      await newbooking.save();
      const car = await Car.findOne({ _id: req.body.car });
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save();
      res.send("Your booking is successful");
    } else {
      return res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});


router.get("/getallbookings", async(req, res) => {

    try {

        const bookings = await Booking.find().populate('car')
        res.send(bookings)
        
    } catch (error) {
        return res.status(400).json(error);
    }
  
});


module.exports = router;
