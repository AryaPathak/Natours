
const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel')

dotenv.config({path: './config.env'})





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



// READ JSON FILE

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
)

//IMPORT DATA O M DB


const importData = async ()=>{
    try {
        await Tour.create(tours);
        console.log('Data Successfully Loaded!');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

//Delete All DB

const deleteData = async ()=>{
    try {
        await Tour.deleteMany();
        console.log('Data Successfully Deleted!');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete'){
    deleteData()
}

console.log(process.argv);