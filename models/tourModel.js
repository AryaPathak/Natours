/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify')

const validator = require('validator'); 

const user = require('./userModel');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
  name:{
      type: 'string',
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, '40 Chars max'],
      minlength: [10, '10 Chars min']
      // validate: [validator.isAlpha, 'Tour name should only have alphabets']
    },
    slug: String,
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
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Either easy, medium or difficult'
      }  
    },
    priceDiscount:{
      type: Number,
      validate: function(val){
        return val < this.price;
      },
      message: 'Discount should be less than price'
    },
    ratingsAverage:{
      type: Number,
      default: 4.5,
      min: [1, 'minimum 1'],
      max: [5, 'maximum 5'] 
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
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    SecretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String

    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      }  
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
},
{
  toJSON: {virtuals: true},
  toObject : {virtuals: true}
});


tourSchema.virtual('durationWeeks').get(function(){
  return this.duration/7;
})


//Document Middleware
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, { lower: true});
  next();
})

// eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre('save', async function(next){
//   const guidesPromises = this.guides.map(async id => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// })

// // eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre('save', function(next){
//   console.log('will save document...');
//   next();
// })

// // eslint-disable-next-line prefer-arrow-callback
// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// })


//Query Middleware


// eslint-disable-next-line prefer-arrow-callback
// tourSchema.pre('find', function(next){


tourSchema.pre(/^find/, function(next){
  this.find({SecretTour: {$ne:true}})
  this.start = Date.now();
  next();
})

// eslint-disable-next-line prefer-arrow-callback
tourSchema.pre(/^find/, function(next){
  this.populate({
    path:'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
})


// eslint-disable-next-line prefer-arrow-callback
tourSchema.post(/^find/, function(docs,next){
  console.log(`Query took ${Date.now() - this.start} ms`)
  
  next();
})


//Agregation Middleware
tourSchema.pre('aggregate', function(next){

  this.pipeline().unshift({$match: {SecretTour: {$ne: true}}})
  console.log(this.pipeline());
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
