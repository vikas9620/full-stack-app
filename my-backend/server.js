const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;


mongoose.connect('mongodb+srv://vikassingh9620:LAWPivQHa89MGACD@cluster0.3i7qzd0.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const configurationSchema = new mongoose.Schema({
  id: String,
  data: [[String]],
  remark: String,
});

const Configuration = mongoose.model('Configuration', configurationSchema);

app.use(bodyParser.json());

app.get('/api/configurations/:id', async (req, res) => {
  const configurationId = req.params.id;

  try {
    const configuration = await Configuration.findOne({ id: configurationId });
    if (configuration) {
      res.json(configuration.data);
    } else {
      res.status(404).json({ error: 'Configuration not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/configurations/:id', async (req, res) => {
  const configurationId = req.params.id;
  const newRemark = req.body.remark;

  try {
    const configuration = await Configuration.findOne({ id: configurationId });

    if (configuration) {
      configuration.remark = newRemark;
      await configuration.save();
      res.json({ message: 'success' });
    } else {
      res.status(404).json({ error: 'Configuration not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
