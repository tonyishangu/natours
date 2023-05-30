const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tours')
const userRouter = require('./routes/user')

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// const tours = fs.readFileSync(`__dirname`)





// routes
// tour routes
// const tourRouter = express.Router()
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// user routes


module.exports = app