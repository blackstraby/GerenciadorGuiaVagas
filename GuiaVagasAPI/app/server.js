import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Promise from 'bluebird';
//Routes
import routerApp from './routes/routerApp';
import routerWeb from './routes/routerWeb';

dotenv.config();

const app = express();
app.use(bodyParser.json());
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });

app.use('/api/routerApp', routerApp);
app.use('/api/routerWeb', routerWeb);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));
