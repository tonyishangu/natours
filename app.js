const fs = require('fs')
const express = require('express')
const app = express()

// const tours = fs.readFileSync(`__dirname`)
const tours = JSON.parse(fs.readFileSync(`${ __dirname}/dev-data/data/tours-simple.json`))

// app.get('/', (req, res) => {
//     res.status(200).json({message: 'Hello from the server side', app: 'natours'})
// })
// app.post('/', (req, res) => {
//     res.send('You can send data to this url')
// })

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
})

const port = 3000
app.listen(port, () => {
    console.log(`app running on port ${port}`);
})