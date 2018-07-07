'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import router from './auth/router.js';

import errorhandler from './middleware/error.js';
import notFound from './middleware/404.js';

let app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(epress.json());
app.use(express.urlencoded({extended:true}));

app.use(router);

app.use(errorhandler);
app.use(notFound);

let server;

module.exports = {
  start: (port) => {
    if(!server) {
      server = app.listen(port, (err) => {
        if(err) {throw err;}
        console.log('Server up on port, ', port);
      });
    }
    else{
      console.log('Server already up.');
    }
  },

  stop: () => {
    server.close(() => {
      console.log('Server is closed.');
    });
  },
};