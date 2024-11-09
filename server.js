const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Import CORS

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

const port = process.env.PORT || 3000;

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use your preferred email service
  auth: {
    user: 'mugniermartin@gmail.com',
    pass: 'P49XAT7YQUED',
  },
});

// API endpoint to handle booking form submission
app.post('/bookSlot', (req, res) => {
  const { firstName, lastName, email, slot } = req.body;

  // Send email to admin
  const mailOptions = {
    from: 'mugniermartin.gmail.com',
    to: 'martin.mugnier@psemail.eu',
    subject: 'New Office Hours Booking',
    text: `A new booking has been made by ${firstName} ${lastName} for the slot ${slot}. Email: ${email}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).send({ error: 'Failed to send email.' });
    }
    res.status(200).send({ message: 'Booking successful! Confirmation email sent.' });
  });
});

// Handle OPTIONS preflight requests
app.options('*', cors()); // Enable preflight for all routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
