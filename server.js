
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'})

const app=require('./app');




mongoose
  .connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connection established');
    
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });






const tourSchema = new mongoose.Schema({
    name:{
      type: 'string',
      required: [true, 'A tour must have a name'],
      unique: true
    },
    rating:{
      type: Number,
      default: 4.5
    },
    price:{
      type: Number,
      required: [true, 'A tour must have a price']
    }
});

const Tour = mongoose.model('Tour', tourSchema);


const testTour = new Tour({
  name: 'The forest hiker 2',
  rating: 4.7,
  price: 497
})


testTour
  .save()
  .then(doc=>{
  console.log(doc);
})
.catch(err=>{
  console.log('error💥💥💥💥:', err);
})

const port = process.env.PORT || 3000;

app.listen(port, () =>{
  console.log(`App running in the port ${port}...`);
})

