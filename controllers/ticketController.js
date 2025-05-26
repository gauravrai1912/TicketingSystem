const Ticket = require('../models/Ticket');

// Customer: Create ticket
exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      subject: req.body.subject,
      description: req.body.description,
      customer: req.user._id,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: 'Ticket creation failed', error: err.message });
  }
};

exports.getOwnTickets = async (req, res) => {
  const tickets = await Ticket.find({ customer: req.user._id });
  res.json(tickets);
};

exports.getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('customer agent', 'name email');
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  if (req.user.role === 'customer' && ticket.customer._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(ticket);
};

exports.resolveTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  ticket.status = 'resolved';
  ticket.agent = req.user._id;
  await ticket.save();

  res.json(ticket);
};
