const express = require('express');
const router = express.Router();
const client = require('../database');

router.get('/form', function(req, res, next) { 
  res.render('users-form'); 
});

router.post('/create', async function(req, res, next) {
  const userDetails = req.body;

  try {
    const db = client.db('voting');
    const collection = db.collection('users');

    await collection.insertOne(userDetails);
    console.log("User data is inserted successfully");

    res.redirect('/users/form'); // redirect to user form page after inserting the data
  } catch (err) {
    console.error("Error inserting user data:", err);
    next(err);
  }
});

module.exports = router;
