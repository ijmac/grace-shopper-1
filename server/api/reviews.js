const router = require('express').Router()
const {Review, User} = require('../db/models')
module.exports = router

// return all reviews
router.get('/', (req, res, next) => {
  Review.findAll()
    .then(reviews => res.json(reviews))
    .catch(next)
})

// returns reviews for one product
router.get('/product/:productId', (req, res, next) => {
  Review.findAll({
    where: {
      productId: req.params.productId
    },
    include: [
      {
        model: User,
        attributes: [ 'name' ]
      }
    ]
  })
    .then(foundReviews => res.json(foundReviews))
    .catch(next)
})

// creates new review
router.post('/', (req, res, next) => {
  Review.create(req.body)
    .then(newReview => res.json(newReview))
    .catch(next)
})

// deleting a review is ADMIN ONLY
