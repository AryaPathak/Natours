const APIFeatures = require("../utils/apiFeatures");


exports.deleteOne = Model => async(req,res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, req.body)
    if(!doc){
        const error = new Error('Document not found');
        error.statusCode = 404; 
        return next(error);
    }
    

    res.status(204).json({
        status:'success',
        data:null
    });

}


exports.updateOne = Model => async(req, res, next) => {
    
    
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    })

    if(!doc){
        const error = new Error('Document not found');
        error.statusCode = 404; 
        return next(error);
    }
    
    res.status(200).json({
        status:'success',
        data:{
          data: doc
        }
    })
    
    
  }


  exports.createOne = Model => async(req, res, next) => {

    
    const doc = await Model.findById(req.params.id).populate('reviews');
    if(!doc){
        const error = new Error('Document not found');
        error.statusCode = 404; 
        return next(error);
    }
    res.status(201).json({
        status: 'success',
        data:{
          data: doc
        }
    });
  
    
    
  }
  

  exports.getOne = (model, popOptions) => async(req, res, next) => {
    let query = model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    
    const doc = await query;
    if(!doc){
        const error = new Error('Document not found');
        error.statusCode = 404; 
        return next(error);
    }
    res.status(201).json({
        status: 'success',
        data:{
          data: doc
        }
    });
  
    
    
  }
  


  exports.getAll = Model => async(req, res, next) => {

    let filter = {};
    if(req.params.tourId) filter = { tour: req.params.tourId };
    
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await features.query;
 
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data:{
          data: doc
        }
    });
  
 
  }

