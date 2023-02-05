import React, { useState } from 'react'
import styled from 'styled-components'

// Component that manages booking of the seats.
// It also manages how to find nearby seats.
export const Booking = ({status, setStatus, reset}) => {
  // calculate current available seats
  // it will help to set upper limit on number of
  // seats user can select currently.
  let available = 0;
  for(let i=0; i<80; i++)
    if(status[i]===false) available++;

  // seats state will basically store user input - number of seats user wants to book.
  const [seats, setSeats] = useState(1);
  // to show the output (seat numbers booked) to the user.
  const [notification, setNotification] = useState({status: false, seats: ''});

  // will handle input change.
  const handleChange = (e) => {
    setSeats(e.target.value);
  }

  // will change the state of the best seats possible for the user to booked from available.
  const bookTickets = (start) => {
    let booked = 0;         // number of seats booked
    let seatNumbers = [];   // seat numbers which are booked.
    while(booked < seats){
        // if seat is available, book it and store the in in seatNumbers.
        if(!status[start]){
            seatNumbers.push(start);
            booked++;   // number of booked seats will increase.
        }
        start++;

        // once booked seats equals to the input we will break this loop.
    }

    // making API call, using fetch api, to store the details in the backend.
    fetch("https://ticket-booking-api-txa9.onrender.com/book", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(seatNumbers)
    });

    setStatus(seatNumbers);

    // will return seatNumbers.
    return seatNumbers;
  }

  // To find nearby seats, when we can't find all seats in one row.
  const findNearbySeats = () => {
    // finding the array containing all current available seats.
    let availableSeats = [];
    for(let i=0; i<80; i++)
        if(status[i]===false) availableSeats.push(i);
    
    // finding N seats in which maximum difference is minimum.
    // It will take O(N) time.
    let n = availableSeats.length, mini = 81, end = seats-1, strt = 0;
    for(let i=0; i<=n-seats; i++){
        if(availableSeats[end] - availableSeats[i] < mini){
            mini = availableSeats[end] - availableSeats[i];
            strt = i;
        }

        end++;
    }

    // Booking tickets starting from strt index.
    return bookTickets(availableSeats[strt]);
  }

  // to handle 'Book' click.
  const handleClick = (e) => {
      // traversing row wise, in the coach.
      let base = 0, strt, f = false;
      let ans;
      for(let i=1; i<=12; i++){
          let flag = false;
          let empty = 0;
          for(let j=1; j<8; j++){
            // will count total number of seats available in current row.
            if(status[base + j - 1]===false && !flag){
                strt = base + j;
                empty++;
                flag = true;
            } else if(status[base + j - 1]===false) empty++;

          }
          
          // if empty seats in current row is greater than equal to input then will allocate
          // seats from that row to user.
          if(empty >= seats){
            ans = bookTickets(strt-1);
            f = true;
            break;
          }

          // increasing base to access next row.
          base = base + 7;
      }

      // if couldn't find seats in one row, will find nearby seats.
      if(!f) ans = findNearbySeats();

      // Generating String of Seat numbers to show to the user.
      ans = ans.map(i => i+1);
      setNotification(prev => {
        prev.status = true;
        prev.seats = ans.join(', ');
        return {...prev}
      });

      // after 5 seconds we will remove the output.
      setTimeout(() => setNotification({status: false, seats: ''}), 5000);
  }

  return (
    <Container>
        {/* If available seats are more than 0 then only show the input field. */}
        { (available > 0) && 
            <>
                {/* Input box to take number of seats as input from the user. */}
                <InputBox type={"number"} value={seats} onChange={handleChange} min={1} max={Math.min(available, 7)}/>
                {/* Button to book seats. */}
                <BookButton disabled={seats > Math.min(available, 7) || notification.status} onClick={handleClick}>Book</BookButton>
                {/* Button to reset the whole coach */}
                <ResetButton disabled={available===80} onClick={() => reset()}> Reset </ResetButton>
            </>
        }

        {/* if notification state is set then will show seat numbers booked for the user. */}
        {
            notification.status &&
            <>
                <p><b>You have successfully booked {seats} ticket(s)</b></p>
                <p><b>Here are you seat number(s): {notification.seats}</b></p>
            </>
        }

        {/* Just showing friendly message to the user. */}
        { 
            (available > 0) && 
            <p><b>Please Select Number of Seats You want to Book! 🙂🎫</b></p> 
        } 

        {/* Handling invalid inputs */}
        { 
            (available > 0  && available < 7 && seats>available) && 
            <p style={{color: "red"}}><b>You can't book {seats} ticket(s) for now☹️.</b></p>
        }

        {/* Showing the limit to the user. */}
        { 
            (available > 0  && available >=7 && seats>7) && 
            <p style={{color: "red"}}><b>You can only book up to {7} tickets at a time.</b></p>
        }

        {/* When no tickets are available */}
        {
            !available && 
            <>
                <p style={{color: "red", fontSize: "1.5em"}}><b>Tickets SOLD OUT 😓</b></p>
                <p style={{opacity: "0.6", width: "auto"}}>Please try again some time later!</p>
                <ResetButton disabled={available===80} onClick={() => reset()}> Reset </ResetButton>
            </>
        }
    </Container>
  )
}

// Styling the container of the component.
// fixing width, bringing content to center, etc.
const Container = styled.div`
    width: 100%;
    text-align: center;
    padding-top: 3em;
    padding-bottom: 1em;
    margin-top: 0em;
`;

// Styling the button for Booking the seats.
const BookButton = styled.button`
    padding: .5em 1em;
    font-weight: bold;
    border-radius: 5px;
    background-color: blue;
    color: white;
    border: none;
    cursor: pointer;
    margin-left: 1em;
    
    // when hovering.
    &:hover{
        background-color: rgba(0, 0, 255, .8);
    }

    // When disabled - when seats more than current limit are selected.
    &:disabled{
        opacity: .4;
        cursor: not-allowed;
    }
`;

// Styling the Reset Button.
const ResetButton = styled.button`
    padding: .5em 1em;
    font-weight: bold;
    border-radius: 5px;
    background-color: red;
    color: white;
    border: none;
    cursor: pointer;
    margin-left: 1em;

    // When Hovering
    &:hover{
        background-color: rgba(255, 0, 0, .8);
    }

    // When Disabled - when it is already reseted.
    &:disabled{
        opacity: .4;
        cursor: not-allowed;
    }
`;

// Styling the input box. 
const InputBox = styled.input`
    text-align: center;
    font-weight: bold;
    outline: none;
    display: inline-block;
    width: 10%;
    margin-inline: auto;
    padding: .5em .75em;
`;


