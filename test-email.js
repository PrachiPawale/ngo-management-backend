require('dotenv').config();

const transporter = require('./config/mailer');

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'prachipawale7@gmail.com',
  subject: 'NGO Website Test Email',
  text: 'Email service is working successfully.'
})
.then((info) => {
  console.log('Email sent successfully');
  console.log('Message ID:', info.messageId);
})
.catch((error) => {
  console.error('Email failed:', error);
});