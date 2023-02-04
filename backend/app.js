const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

// handling CORS - Cross Origin Resourse Sharing.
app.use(cors());
// So that we can parse JSON data coming from the client side.
app.use(express.json());

// route to handle 'reset' request, to reset the whole Coach.
app.get('/reset', (req, res) => {
    // making all seats available.
    let data = [];
    for(let i=0; i<80; i++)
        data.push(false);
    
    // writing the data in our local file ~ used as database here.
    fs.writeFileSync('./data.json', JSON.stringify(data));

    // end the response.
    res.end(); 
});

// route to handle 'book' request, to book tickets in our database.
app.post('/book', (req, res) => {
    // getting the seat numbers from the client.
    let seats = req.body;
    // reading current data.
    let data = fs.readFileSync('./data.json', 'utf-8');
    data = JSON.parse(data);

    // updating current data, marking seat numbers booked.
    for(let i=0; i < seats.length; i++)
        data[seats[i]] = true;
    
    // writing back to local data file ~ used here as database.
    fs.writeFileSync('./data.json', JSON.stringify(data));

    // sending the new data to the client.
    res.json(data).status(200).end();
});

// default path, will basically return the current data.
app.get('/', (req, res) => {
    let data = fs.readFileSync('./data.json', 'utf-8');
    res.json(data).status(200).end();
});

// Listening for the requests...
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening @port: ${PORT}`));