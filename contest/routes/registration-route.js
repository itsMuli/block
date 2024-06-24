const express = require('express');
const router = express.Router();
const client = require('../database');
const app = express();

app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

// to display registration form
router.get('/register', function(req, res, next) {
  res.render('registration-form.ejs');
});

// to store user input detail on post request
router.post('/register', async function(req, res, next) {
  const inputData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_address: req.body.email_address,
    gender: req.body.gender,
    password: req.body.password,
    confirm_password: req.body.confirm_password
  };

  try {
    const db = client.db('voting');
    const collection = db.collection('registration');

    // check unique email address
    const data = await collection.find({ email_address: inputData.email_address }).toArray();

    let msg = '';
    if (data.length > 0) {
      msg = `${inputData.email_address} already exists`;
    } else if (inputData.confirm_password !== inputData.password) {
      msg = "Password & Confirm Password do not match";
    } else {
      // save user's data into database
      await collection.insertOne(inputData);
      msg = "You are successfully registered";
    }

    res.render('registration-form.ejs', { alertMsg: msg });
  } catch (err) {
    console.error("Error during registration:", err);
    next(err);
  }
});

module.exports = router;
