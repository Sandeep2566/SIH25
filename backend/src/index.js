import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agritrace';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


import produceRoutes from './routes/produce.js';
app.use('/api/produce', produceRoutes);

import blockchainRoutes from './routes/blockchain.js';
app.use('/api/blockchain', blockchainRoutes);

import blockchainActions from './routes/blockchainActions.js';
app.use('/api/blockchain/actions', blockchainActions);

app.get('/', (req, res) => {
  res.send('AgriTrace Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
