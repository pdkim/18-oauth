'use strict';

import express from 'express';

const authRouter = express.Router();

import User from './model.js';
import auth from './middleware.js';
import oauth from './lib/oauth.js';


authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( user => res.send(user.generateToken()) )
    .catch(next);
});

authRouter.get('/login',auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/oauth', (req, res, next) => {

  let URL = process.env.CLIENT_URL;


  oauth.authorize(req)
    .then ( token => {
      res.cookie('auth', token);
      res.redirect(`${URL}?token=${token}`);
    })
    .catch(next);
});

authRouter.get('/showMeTheMoney', auth, (req,res,next) => {
  res.send('Here is all the ca$h');
});

export default authRouter;