const fs = require('fs');
const express = require('express');

const morgan = require('morgan');

const app = express();


app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  console.log("hello from middelware")
  next();
})

app.use(express.json());




//All the functions were here



app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);





module.exports=app;