import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { Booking } from './Booking'
import { Seats } from './Seats';
import { Seat } from './Seat';

// Coach Component the main component, which can be 
// used when there is need of multiple coaches.
export const Coach = () => {

  // state to store current state / status of all the seats.
  const [status, setStatus] = useState([]);

  // Fetching the data from backend about the booking.
  useEffect(() => {
    // used fetch api to make request to API endpoint.
    console.log(process.env.API_URL);
    fetch("https://ticket-booking-api-txa9.onrender.com/").then(res => res.json())
    .then(data => {
      // Parsing JSON Data to get normal JS array.
      data = JSON.parse(data);
      // updating the status of the Coach.
      setStatus([...data]);
    });
  }, [])

  // Function to handle booking function
  // it is used inside Booking Component.
  const handleBooking = (i) => {
    setStatus(prev => {
        // updating the state of Coach,
        // this will temporarely update the Coach state.
        // permenant state change in the database will happen in Booking
        for(let j=0; j<i.length; j++)
          prev[i[j]] = true;
        return [...prev];
    });
  }

  // function to reset the Coach state
  // Just for testing purposes.
  const reset = () => {
    fetch("https://ticket-booking-api-txa9.onrender.com/reset");
  }

  return (
    <Container>
        {/* Passing function to handle booking, function to reset the state of coach 
            to the booking and the state of coach to the Booking Component */}
        <Booking status={status} setStatus={handleBooking} reset={reset}/>
        <Desc>
          <Seat num={" "} status={true}/>
          <p>{"Booked"}</p>
          <Seat num={" "} status={false}/>
          <p>{"Available"}</p>
        </Desc>
        <Seats status={status}/>
    </Container>
  )
}

// Just adding a little styling to the main component.
const Container = styled.div`
  border: 2px solid black;
  background-color: #FAF8F1;
`;

// styling the description box, boxes to show available and booked colors.
const Desc = styled.div`
  margin-bottom: 1em;
  text-align: center;
  display: flex;
  justify-content: center;
`;