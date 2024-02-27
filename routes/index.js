import express from 'express';
import Auth from './auth.js';
import { Verify } from '../middleware/verify.js';


const app = express();

app.disable('x-powered-by');

app.get('/AudioFile.v1', (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: [],
      message: 'Welcome to our API homepage!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
});

app.get('/user', Verify, (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to your Dashboard!',
    });
});

app.use('/auth', Auth);

export default app;