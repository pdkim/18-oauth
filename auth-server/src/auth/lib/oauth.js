'use strict';

import superagent from 'superagent';

import User from '../model';


const authorize = (req) => {

  let code = req.query.code;

  console.log('(1) code', code);

  return superagent.post('https://api.login.yahoo.com/oauth2/get_token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.YAHOO_CLIENT_ID,
      client_secret: process.env.YAHOO_CLIENT_SECRET,
      redirect_uri: 'http://86de7bbf.ngrok.io/oauth',
      grant_type: 'authorization_code',
    })
    .then( response => {
      let yahooToken = response.body.access_token;
      console.log('(2) yahoo token', yahooToken);
      return yahooToken;
    })
    // .then ( token => {
    //   return superagent.get('https://api.login.yahoo.com/oauth2/get_token')
    //     .set('Authorization', `Bearer ${token}`)
    //     .then (response => {
    //       let user = response.body;
    //       console.log('(3) Yahoo User', user);
    //       return user;
    //     });
    // })
    .then(token => {
      return superagent
        .post('https://api.login.yahoo.com/oauth2/get_token')
        .send({
          client_id: process.env.YAHOO_CLIENT_ID,
          client_secret: process.env.YAHOO_CLIENT_SECRET,
          redirect_uri: 'http://86de7bbf.ngrok.io/oauth',
          code: token,
          grant_type: 'authorization_code',
        })
        .set('Content-Type','application/x-www-form-urlencoded');
    })
    .then(yahooUser => {
      console.log('(4) Creating Account');
      return User.createFromOAuth(yahooUser);
    })
    .then (user => {
      console.log('(5) Created User, generating token');
      return user.generateToken();
    })
    .catch(error=>error);
};



export default {authorize};