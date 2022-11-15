const express = require("express");
const session = require('express-session');
const path = require("path");
const yaml = require("node-yaml-config");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const {loginCheck} = require('./core/passport');
const fs = require("fs");

const config = yaml.load("config.yml");
const port = config.port; // default port to listen
const app = express();

let BetterNAS = {
  IS_DEBUG: process.env.NODE_ENV === 'development',
  IS_MASTER: true,
  ROOTPATH: process.cwd(),
  SERVERPATH: path.join(process.cwd(), 'src'),
  config: yaml.load("config.yml"),
}
global.BetterNAS = BetterNAS

// ----------------------------------------
// Init Logger
// ----------------------------------------

BetterNAS.logger = require('./core/logger').init('MASTER')

BetterNAS.logger.info('=======================================')
BetterNAS.logger.info(`= BetterNAS`)
BetterNAS.logger.info('=======================================')
BetterNAS.logger.info('Initializing...')


BetterNAS.models = require('./core/db').init()

try {
  BetterNAS.models.onReady
} catch (err) {
  BetterNAS.logger.error('Database Initialization Error: ' + err.message)
  if (BetterNAS.IS_DEBUG) {
    BetterNAS.logger.error(err)
  }
  process.exit(1)
}

//loginCheck(passport);


// Configure Express to use EJS
app.use(session({
  secret:'oneboy',
  saveUninitialized: true,
  resave: true
}));
app.set( "views", path.join( __dirname, "views" ) );
app.use( express.static( path.join( __dirname, "assets" ) ) );
app.set( "view engine", "ejs" );
app.use(express.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());


BetterNAS.logger.info('Loading Routes');

//Routes
fs.readdirSync(BetterNAS.SERVERPATH + '/routes/').forEach(function(file) {4
  app.use('/', require(BetterNAS.SERVERPATH + '/routes/' + file));
  BetterNAS.logger.info('=== Loaded route: ' + file);
});

// start the Express server
app.listen( port, () => {
  BetterNAS.logger.info( `Server started at http://localhost:${ port }` );
} );