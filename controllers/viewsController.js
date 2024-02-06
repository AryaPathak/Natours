const Tour = require('../models/tourModel');

exports.getOverview = async (req, res) => {
    //get tour data
    const tours = await Tour.find();
    //build template

    //render that data
    res.status(200).render('overview',{
      title: 'All Tours',
      tours
    });
}

exports.getTour = async (req, res, next) => {
    //get data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

     

    //build template

    //render data

    res.status(200).render('tour',{
      title: `${Tour.name} Tour`,
      tour
    });
  }

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  })
}

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
}