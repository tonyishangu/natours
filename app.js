const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello from the server side', app: 'natours'})
})
app.post('/', (req, res) => {
    res.send('You can send data to this url')
})

const port = 3000
app.listen(port, () => {
    console.log(`app running on port ${port}`);
})