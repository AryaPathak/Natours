const express = require('express');
const Tour = require('./../models/tourModel');




exports.checkbody = (req, res, next)=>{
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next();
}


exports.getAllTours = (req, res)=>{
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime
    })
}



exports.getTour = (req, res)=>{
    console.log(req.params);
    const id = req.params.id*1;

    

    
    

}


exports.createTour = (req, res)=>{
    //console.log(req.body);
    res.status(201).json({
        status: 'success'
    })
    
}

exports.updateTour = (req, res)=>{

    

    res.status(200).json({
        status:'success',
        data:{
            tour:'<Update tour here...>'
        }
        
    })
}

exports.deleteTour = (req, res)=>{

    

    res.status(204).json({
        status:'success',
        data:null
        
    })
}

