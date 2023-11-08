const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')

dotenv.config({path:'./config.env'})

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser : true,
  useCreateIndex: true,
  useFindAndmodify: false
}).then(() => {
  console.log(`Database connected successfully`)
})

// simple tour model -------schema------
// schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required:[true, 'tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'tour must have a price']
  },
})
// the model
const Tour = mongoose.model('Tour', tourSchema);

const testTour  = new Tour({
  name:'test tour',
  price: 9000,
  rating: 4.7
})

testTour.save().then(doc => {
  console.log('doc..:', doc)
}).catch(err => {
  console.log('My guy doing your own things i see', err)
})

// middlewares
app.use(morgan('dev'))
app.use(express.json());
app.use((req, res, next) => {
    console.log('hello from middleware');
    next()
})
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})
app.use(cors({
  origin: '*'
}))

// const tours = fs.readFileSync(`__dirname`)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// route handlers
const getAllTours = (req, res) => {
    console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // if(id > tours.length){
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};


// routes
app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// running app
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
