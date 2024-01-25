const path = require('path');
const fs = require('fs');
const express = require('express');

const morgan = require('morgan');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');



console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  console.log("hello from middelware")
  next();
})

app.use(express.json());



app.get('/', (req, res)=>{
  res.status(200).render('base',{
    tour:'The forest hiker'

  });
})



app.get('/overview', (req, res) => {
  res.status(200).render('overview',{
    title: 'All Tours'
  });
})

app.get('/tour', (req, res) => {
  res.status(200).render('tour',{
    title: 'The forest hiker'
  });
})


//All the functions were here

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


module.exports=app;