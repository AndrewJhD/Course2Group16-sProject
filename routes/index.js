import express from 'express';
import Auth from './auth.js';


const app = express();

app.get('/server.js', (req, res) => {
    try {
      res.status(200).json({
        status: 'success',
        data: [],
        message: 'Welcome to our API homepage!',
      });
    } catch (err) {
      res.status(500.).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  });

  export default app;

  app.use('/auth', Auth);