const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Dummy data store
let availableSlots = [
  '2025-01-24 09:00', '2025-01-24 09:15', '2025-01-24 09:30', // Add all slots here
  '2025-04-11 11:45'
];
let bookings = {};

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/bookSlot', (req, res) => {
  const { name, email, slot } = req.body;
  if (!availableSlots.includes(slot)) {
    return res.status(400).json({ error: 'Slot unavailable' });
  }
  bookings[slot] = { name, email };
  res.json({ message: 'Booking requested' });

  // Send email to admin for confirmation
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Booking Request',
    text: `Booking request from ${name} for slot: ${slot}`
  });
});

app.post('/confirmSlot', (req, res) => {
  const { slot } = req.body;
  if (!bookings[slot]) {
    return res.status(400).json({ error: 'No booking for this slot' });
  }
  availableSlots = availableSlots.filter(s => s !== slot);
  const { name, email } = bookings[slot];

  // Send confirmation to student
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Booking Confirmed',
    text: `Your booking for slot ${slot} is confirmed.`
  });
  delete bookings[slot];
  res.json({ message: 'Slot confirmed and email sent' });
});

app.post('/cancelSlot', (req, res) => {
  const { slot } = req.body;
  if (bookings[slot]) {
    delete bookings[slot];
    res.json({ message: 'Booking cancelled' });
  } else {
    res.status(400).json({ error: 'No booking for this slot' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
