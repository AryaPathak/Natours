const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const factory =  require("./handlerFactory");

exports.aliasTopTours = (req,res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};


// exports.getAllTours = async (req, res) => {
//   try{
//     //Execute Query
//     const features = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     const tours = await features.query;

//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data:{
//         tours
//       }
//     })
//   }catch(err){
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     })
    
//   }
// }  




  // exports.getTour =async(req, res) => {

  //   try{
  //     const tour = await Tour.findById(req.params.id).populate('reviews');
  //     res.status(200).json({
  //       status: 'success',
  //       data:{
  //         tour
  //       }
  //     })
  //   }catch(error){
  //     res.status(404).json({
  //       status: 'fail',
  //       message: error
  //     })
  //   }
 
  // }
  
  

  // exports.createTour = async (req, res) => {

  //   try{
  //     const newTour = await Tour.create(req.body);

  //     res.status(201).json({
  //       status: 'success',
  //       data:{
  //         tour: newTour
  //       }
  //     });
  
  //   }catch(err){
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err
  //     })
  //   }
    
  // }
  

  
  // exports.updateTour = async(req, res) => {
    
  //   try{
  //     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
  //       new: true,
  //       runValidators: true
  //     })
  //     res.status(200).json({
  //       status:'success',
  //       data:{
  //         tour
  //       }
  //     })
  //   }catch(err){
  //     res.status(404).json({
  //       status: 'fail',
  //       message: err
  //     })
  //   }
    
  // }
  
  
  // exports.deleteTour = async(req,res) => {
    
  //   try{
  //     const tour = await Tour.findByIdAndDelete(req.params.id, req.body)

  //     res.status(204).json({
  //       status:'success',
  //       data:null
  //     });
      
  
  //   }catch(err){
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err
  //     })
  //   }
  
   
  // }

  exports.deleteTour = factory.deleteOne(Tour);
  exports.updateTour = factory.updateOne(Tour);
  exports.createTour = factory.createOne(Tour);
  exports.getTour = factory.getOne(Tour, {path: 'reviews'});
  exports.getAllTours = factory.getAll(Tour);

exports.getToursStats = async (req, res) => {
  try{
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: {$gte: 4.5} }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty'},
          num: { $sum: 1},
          numRatings: { $sum: '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price'},
          maxPrice: { $max: '$price'},
        }
      },
      {
        $sort: { avgPric: 1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    })
  }catch(err){
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}


exports.getMonthlyPlan = async (req, res) => {
  try{
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name'}
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {
        $project: {
          _id:0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }

    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })
  }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

