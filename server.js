
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




const port = process.env.PORT || 3000;

app.listen(port, () =>{
  console.log(`App running in the port ${port}...`);
})

