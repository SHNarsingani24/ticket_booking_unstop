import React from 'react'
import styled from 'styled-components'

// Component for each seat, nothing just a square.
export const Seat = ({num, status}) => {
  return (
    // background color will be based on current status of the seat.
    <Container style={{backgroundColor: status ? "#A7BBC7" : "transparent"}}>{num}</Container>
  );
}

// Styling the seat, setting margin, border, border-radius, etc.
const Container = styled.div`
    width: 22.5px;
    height: 22.5px;
    border-radius: .25em;
    margin: 1em 1em;
    text-align: center;
    border: .5px solid black;
    display: inline-block;
    font-size: .9em;
    font-weight: bold;
`;