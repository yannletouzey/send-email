import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import * as dotenv from 'dotenv';

const app = express();
const PORT = 3001;

dotenv.config(); 

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  secureConnection: false,
  host: process.env.SMTP,
  port: process.env.PORT_SMTP,
  service: 'gmail',
  auth: {
    user: process.env.ADDRESS_EMAIL,
    pass: process.env.PASS_EMAIL,
  },
});
app.post('/', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'The name and message fields are required.' });
  }

  const mailOptions = {
    from: 'email@gmail.com',
    to: process.env.ADDRESS_EMAIL,
    subject: `New message from ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error while sending email:', error);
    res.status(500).json({ error: 'Error while sending email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
