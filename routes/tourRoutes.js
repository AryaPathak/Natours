const express = require('express');
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const reviewRouter = require("./reviewRoutes");


const router = express.Router();

// router.param('id', tourController.checkId)


router.use('/:tourId/reviews', reviewRouter)


router  
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);


router  
  .route('/tour-stats')
  .get(tourController.getToursStats);

router  
  .route('/monthly-plan/:year')
  .get(tourController.getMonthlyPlan);


router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin)


router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);


router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete( 
    authController.protect, 
    // authController.restrictTo('admin', 'lead-guide'), 
    tourController.deleteTour
  );



  // router
  // .route('/:tourId/reviews')
  // .post(
  //   authController.protect,
  //   reviewController.createReview
  // )

module.exports = router;











