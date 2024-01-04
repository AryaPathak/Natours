const Tour = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try{

    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    
    let queryStr = JSON.stringyfy(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log("ghjsbjb");
    console.log(JSON.parse(queryStr));
    console.log("fkjfj");

    const query = Tour.find(queryObj);

    const tours = await query;

    // const query = await Tour.find()
    //   .where('duration').equal
    
    //   .where('difficulty').equals('easy');

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data:{
        tours
      }
    })
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
    
  }
}  
  exports.getTour =async(req, res) => {

    try{
      const tour = await Tour.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        data:{
          tour
        }
      })
    }catch(error){
      res.status(404).json({
        status: 'fail',
        message: error
      })
    }
 
  }
  
  
  exports.createTour = async (req, res) => {

    try{
      const newTour = await Tour.create(req.body);

      res.status(201).json({
        status: 'success',
        data:{
          tour: newTour
        }
      });
  
    }catch(err){
      res.status(400).json({
        status: 'fail',
        message: err
      })
    }
    
  }
  
  
  exports.updateTour = async(req, res) => {
    
    try{
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
      })
      res.status(200).json({
        status:'success',
        data:{
          tour
        }
      })
    }catch(err){
      res.status(404).json({
        status: 'fail',
        message: err
      })
    }
    
  }
  
  
  
  
  
  exports.deleteTour = async(req,res) => {
    
    try{
      const tour = await Tour.findByIdAndDelete(req.params.id, req.body)

      res.status(204).json({
        status:'success',
        data:null
      });
      
  
    }catch(err){
      res.status(400).json({
        status: 'fail',
        message: err
      })
    }
  
   
  }





