const express = require('express');
const router = express.Router();
const client = require('../database');

// another routes also appear here
// this script to fetch data from MongoDB database collection
router.get('/table_view', async function (req, res, next) {
  try {
    const db = client.db('');
    const collection = db.collection('registered_users');

    const data = await collection.find({}).toArray();
    
    res.render('adminVoterReg', {
      title: 'Registered Users List',
      userData: data,
    });
  } catch (err) {
    console.error("Error fetching registered users:", err);
    next(err);
  }
});

module.exports = router;
