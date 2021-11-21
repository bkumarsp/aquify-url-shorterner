const mongoose = require('mongoose'); 
const config = require('config'); 

const db = config.get('mongouri'); // Fetching MongoDB URL from config.json

// Function to Connect MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('Database Connected Successfully...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB; 