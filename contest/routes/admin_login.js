const express = require('express');
const router = express.Router();
const client = require('../database');
const app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));

/* GET users listing. */
router.get('/adlogin', function (req, res, next) {
  res.render('admin_login.ejs');
});

router.post('/adlogin', async function (req, res) {
  const emailAddress = req.body.email_address;
  const password = req.body.password;

  try {
    const db = client.db('voting');
    const collection = db.collection('registration');

    const data = await collection.findOne({ email_address: emailAddress, password: password });

    if (data) {
      req.session.loggedinUser = true;
      req.session.emailAddress = emailAddress;
      res.redirect('/addCandidate');
    } else {
      res.render('admin_login.ejs', { alertMsg: "Your Email Address or password is wrong" });
    }
  } catch (err) {
    console.error('Error during admin login:', err);
    res.render('admin_login.ejs', { alertMsg: "An error occurred. Please try again." });
  }
});

module.exports = router;
