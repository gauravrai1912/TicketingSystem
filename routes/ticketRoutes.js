const express = require('express');
const router = express.Router();

const {
  createTicket,
  getOwnTickets,
  getTicketById,
  resolveTicket,
} = require('../controllers/ticketController');

const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.use(auth);

router.post('/', role(['customer']), createTicket);
router.get('/', role(['customer']), getOwnTickets);

router.get('/:id', role(['customer', 'agent']), getTicketById);

router.patch('/:id', role(['agent']), resolveTicket);

module.exports = router;
