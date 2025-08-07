require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('P2P Payments API');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
