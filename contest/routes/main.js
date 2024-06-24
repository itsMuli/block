const express = require('express');
const router = express.Router();
const client = require('../database');
const getAge = require('get-age');
const nodemailer = require('nodemailer');

let rand = Math.floor(Math.random() * 10000 + 54);
let account_address;
let data;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'election.blockchain@gmail.com',
    pass: 'ajkprvy7',
  },
});

router.get('/form', function (req, res, next) {
  if (req.session.loggedinUser) {
    res.render('voter-registration.ejs');
  } else {
    res.redirect('/login');
  }
});

router.post('/registerdata', async function (req, res) {
  data = req.body.votingno; // data stores voting no
  account_address = req.body.account_address; // stores metamask acc address
  
  try {
    const db = client.db('voting');
    const collection = db.collection('voting_info');
    
    const results = await collection.findOne({ Votingno: data });
    if (!results) {
      return res.send('Voting number not found');
    }
    
    const dob = results.Dob;
    const email = results.Email;
    const age = getAge(dob);
    const is_registered = results.Is_registered;
    
    if (is_registered !== 'YES') {
      if (age >= 18) {
        const mailOptions = {
          from: 'sharayuingale19@gmail.com',
          to: email,
          subject: 'Please confirm your Email account',
          text: 'Hello, Your otp is ' + rand,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        res.render('emailverify.ejs');
      } else {
        res.send('You cannot vote as your age is less than 18');
      }
    } else {
      res.render('voter-registration.ejs', {
        alertMsg: 'You are already registered. You cannot register again',
      });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    next(error);
  }
});

router.post('/otpverify', async (req, res) => {
  const otp = req.body.otp;
  
  if (otp == rand) {
    try {
      const db = client.db('voting');
      const collection = db.collection('registered_users');
      
      await collection.insertOne({ Account_address: account_address, Is_registered: 'Yes' });
      
      const votingCollection = db.collection('voting_info');
      await votingCollection.updateOne({ Votingno: data }, { $set: { Is_registered: 'YES' } });
      
      const msg = 'You are successfully registered';
      res.render('voter-registration.ejs', { alertMsg: msg });
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.render('voter-registration.ejs', { alertMsg: 'Error during registration' });
    }
  } else {
    res.render('voter-registration.ejs', {
      alertMsg: 'Session Expired! You have entered wrong OTP',
    });
  }
});

module.exports = router;
