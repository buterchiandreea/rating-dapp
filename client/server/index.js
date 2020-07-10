const express = require('express');
const cors = require('cors');
const passport = require('passport');
const strategyKeys = require('../config');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;

/* An object that holds the data returned by a specific strategy */
let user = {};

/* Passport requirements */
passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

/* Google strategy */
passport.use(new GoogleStrategy({
    clientID: strategyKeys.GOOGLE.clientID, 
    clientSecret: strategyKeys.GOOGLE.clientSecret,
    callbackURL: '/auth/google/callback'
}, 
    (accessToken, refreshToken, profile, cb) => {
        user = { ...profile };
        return cb(null, profile);
    })); 

/* Github strategy */
passport.use(new GithubStrategy({
    clientID: strategyKeys.GITHUB.clientID, 
    clientSecret: strategyKeys.GITHUB.clientSecret,
    callbackURL: '/auth/github/callback'
}, 
    (accessToken, refreshToken, profile, cb) => {
        user = { ...profile };
        return cb(null, profile);
    })); 

/* Spotify strategy */
passport.use(new SpotifyStrategy({
    clientID: strategyKeys.SPOTIFY.clientID, 
    clientSecret: strategyKeys.SPOTIFY.clientSecret,
    callbackURL: '/auth/spotify/callback'
}, 
    (accessToken, refreshToken, profile, cb) => {
        user = { ...profile };
        return cb(null, profile);
    })); 

/* Setting up the server */
const app = express();
app.use(cors());
app.use(passport.initialize());

/* Routes */
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
app.get('/auth/google/callback', passport.authenticate('google'), 
    (req, res) => {
        res.redirect('/rate');
    }
);

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github'), 
    (req, res) => {
        res.redirect('/rate');
    }
);

app.get('/auth/spotify', passport.authenticate('spotify'));
app.get('/auth/spotify/callback', passport.authenticate('spotify'), 
    (req, res) => {
        res.redirect('/rate');
    }
);

/* Getting user data */
app.get('/user', (req, res) => {
    res.send(user);
});

/* Logging out */
app.get('/auth/logout', (req, res) => {
    user = {};
    res.redirect('/');
});

/* Port the server is listening to */
const PORT = 5000;
app.listen(PORT);