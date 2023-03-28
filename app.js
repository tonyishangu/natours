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
app.use(express.json())

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = Object.assign({ id: newId}, req.body)

    tours.push(newTour)

    fs.writeFile(`${ __dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
})

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    // if(id > tours.length){
    if(!tour){
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
})

const port = 3000
app.listen(port, () => {
    console.log(`app running on port ${port}`);
})