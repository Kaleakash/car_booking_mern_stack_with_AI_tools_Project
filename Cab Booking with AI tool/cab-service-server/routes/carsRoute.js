const express = require("express");
const router = express.Router();
const Car = require("../models/carModel");

router.get("/getallcars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.send(cars);
  } catch (error) {
    return res.status(400).json(error);
  }
});

// ...existing code...

// Get available cars for a given time range
router.post("/getcabavailability", async (req, res) => {
  const { from, to } = req.body;
  try {
    const cars = await Car.find();
    const availableCars = cars.filter(car => {
      if (car.bookedTimeSlots.length === 0) return true;
      // Check if any slot overlaps
      for (let slot of car.bookedTimeSlots) {
        // If the requested range overlaps with any booked slot, car is not available
        if (
          (from < slot.to && to > slot.from)
        ) {
          return false;
        }
      }
      return true;
    });
    res.send(availableCars);
  } catch (error) {
    return res.status(400).json(error);
  }
});

// ...existing code...
router.post("/addcar", async (req, res) => {
  try {
    const newcar = new Car(req.body);
    await newcar.save();
    res.send("Car added successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/editcar", async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.body._id });
    car.name = req.body.name;
    car.image = req.body.image;
    car.fuelType = req.body.fuelType;
    car.rentPerHour = req.body.rentPerHour;
    car.capacity = req.body.capacity;

    await car.save();

    res.send("Car details updated successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/deletecar", async (req, res) => {
  try {
    await Car.findOneAndDelete({ _id: req.body.carid });

    res.send("Car deleted successfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
