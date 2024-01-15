const User = require("../models/userModel");


const filterObj = (obj, ...allowedFields)=>{
  const newObj ={};
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el))newObj[el]=obj[el];
  })

}

  exports.getAllUsers =async (req, res) => {
   const users = await User.find();
   res.status(200).json({
    status: 'success',
    results: users.length,
    data:{
      users
    }
   })
  }
  

  exports.updateMe = async (req, res, next)=>{
    //create error if user POSTs password data
    if(req.body.passowrd || req.body.passowrdConfirm){
      const error = new Error('this route not for password updates');
        error.status = 400;
        return next(error); 
    }
    //update user documentation
    const filteredBody = filterObj(req.body, 'name', 'email')
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new:true,
      runValidators:true
    });

    res.status(200).json({
      status: 'success',
      data:{
        user: updatedUser
      }
    })
  }

  exports.deleteMe = async(req, res, next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
      status: 'success',
      data: null
    })
  }

  exports.getUser = (req, res) => {
    res.status(500).json({
      status:'error',
      message: 'Not Defined route'
    })
  }
  
  exports.createUser = (req, res) => {
    res.status(500).json({
      status:'error',
      message: 'Not Defined route'
    })
  }
  
  exports.updateUser = (req, res) => {
    res.status(500).json({
      status:'error',
      message: 'Not Defined route'
    })
  }
  
  exports.deleteUser = (req, res) => {
    res.status(500).json({
      status:'error',
      message: 'Not Defined route'
    })
  }
  
  