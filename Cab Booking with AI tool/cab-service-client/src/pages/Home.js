import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DefaultLayout from '../components/DefaultLayout'
import { getAllCars } from '../redux/actions/carsActions'
import { Col, Row, DatePicker, Button } from 'antd'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner';
import moment from 'moment'
const { RangePicker } = DatePicker

function Home() {
    const { cars } = useSelector(state => state.carsReducer)
    const { loading } = useSelector(state => state.alertsReducer)
    const [totalCars, setTotalcars] = useState([])
    const [selectedRange, setSelectedRange] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllCars())
    }, [dispatch])

    useEffect(() => {
        setTotalcars(cars)
    }, [cars])

    // Filter cars based on selected date range
    function checkAvailability() {
        if (selectedRange.length !== 2) return;
        const selectedFrom = moment(selectedRange[0], 'MMM DD yyyy HH:mm')
        const selectedTo = moment(selectedRange[1], 'MMM DD yyyy HH:mm')
        const temp = []

        for (let car of cars) {
            if (car.bookedTimeSlots.length === 0) {
                temp.push(car)
            } else {
                let available = true
                for (let booking of car.bookedTimeSlots) {
                    if (
                        selectedFrom.isBetween(booking.from, booking.to) ||
                        selectedTo.isBetween(booking.from, booking.to) ||
                        moment(booking.from).isBetween(selectedFrom, selectedTo) ||
                        moment(booking.to).isBetween(selectedFrom, selectedTo)
                    ) {
                        available = false
                        break
                    }
                }
                if (available) temp.push(car)
            }
        }
        setTotalcars(temp)
    }

    // Reset filter to show all cars
    function showAllCars() {
        setTotalcars(cars)
        setSelectedRange([])
    }

    return (
        <DefaultLayout>
            <Row className='mt-3' justify='center'>
                <Col lg={20} sm={24} className='d-flex justify-content-left align-items-center'>
                    <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format='MMM DD yyyy HH:mm'
                        value={selectedRange}
                        onChange={values => setSelectedRange(values || [])}
                        style={{ marginRight: 16 }}
                    />
                    <Button type="primary" onClick={checkAvailability} disabled={selectedRange.length !== 2}>
                        Check Availability
                    </Button>
                    <Button onClick={showAllCars} style={{ marginLeft: 8 }}>
                        Show All Cars
                    </Button>
                </Col>
            </Row>

            {loading && <Spinner />}

            <Row justify='center' gutter={16}>
                {totalCars.map(car => (
                    <Col lg={5} sm={24} xs={24} key={car._id}>
                        <div className="car p-2 bs1">
                            <img src={car.image} className="carimg" alt={car.name} />
                            <div className="car-content d-flex align-items-center justify-content-between">
                                <div className='text-left pl-2'>
                                    <p>{car.name}</p>
                                    <p> Rent Per Hour {car.rentPerHour} /-</p>
                                </div>
                                <div>
                                    <button className="btn1 mr-2">
                                        <Link to={`/booking/${car._id}`}>Book Now</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </DefaultLayout>
    )
}

export default Home