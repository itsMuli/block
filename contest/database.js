const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://rose:bobathebear@cluster0.6vksxc0.mongodb.net/'; // Connection URL
const dbName = 'voting'; // Database Name

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('Failed to connect to the database. Error:', err);
    throw err;
  }
  console.log('Database is connected successfully!');
  const db = client.db(dbName);

  // Perform actions on the database here, if needed

  // Close the connection when done
  // client.close();
});

module.exports = client;
