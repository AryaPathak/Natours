const mongoose = require('mongoose');




const tourSchema = new mongoose.Schema({
  name:{
      type: 'string',
      required: [true, 'A tour must have a name'],
      unique: true
    },
    duration:{
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize:{
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    ratingsQuantity:{
      type: Number,
      default: 0
    },
    difficulty:{
      type: String,
      required: [true, 'A tour must have a difficulty']
    },
    priceDiscount:Number,
    ratingsAverage:{
      type: Number,
      default: 4.5
    },
    price:{
      type: Number,
      required: [true, 'A tour must have a price']
    },
    summary:{
      type: String,
      trim: true
    },
    description:{
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    imageCover:{
      type: String,
      required: [true, 'A tour must have a image cover']
    },
    images: [String],
    createdAt:{
      type: Date,
      default: Date.now()
    },
    startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
