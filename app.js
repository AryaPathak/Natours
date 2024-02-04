const path = require('path');
const fs = require('fs');
const express = require('express');

const morgan = require('morgan');

// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));

// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const viewRouter = require('./routes/viewRoutes');


const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());


console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  console.log("hello from middelware")
  next();
})


//Test middelware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log("cookiee token")
  console.log(req.cookies);
  next();
})

app.use(express.json());



//All the functions were here
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


module.exports=app;