const User = require("../models/userModel");


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
  
  