const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3001; 

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define a schema for the data
const textSchema = new mongoose.Schema({
  inputText: String,
  summarizedText: String,
});

// Create a model using the schema
const TextModel = mongoose.model('Text', textSchema);

// Set up middleware to parse JSON
app.use(express.json());

// Set up endpoint to save text and summarized text
app.post('/save', async (req, res) => {
  try {
    const { inputText, summarizedText } = req.body;

    // Create a new document using the model
    const newText = new TextModel({
      inputText,
      summarizedText,
    });

    // Save the document to the database
    await newText.save();

    res.status(200).json({ message: 'Text saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
