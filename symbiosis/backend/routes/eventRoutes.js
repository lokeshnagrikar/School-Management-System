const express = require('express');
const router = express.Router();
const {
    getEvents,
    getUpcomingEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.post('/', protect, authorize('ADMIN'), createEvent);
router.put('/:id', protect, authorize('ADMIN'), updateEvent);
router.delete('/:id', protect, authorize('ADMIN'), deleteEvent);

module.exports = router;
