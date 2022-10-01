const express = require('express');

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getOneTour).patch(updateTour).delete(deleteTour);

module.exports = router;
