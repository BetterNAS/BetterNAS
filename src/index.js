const express = require("express");
const path = require("path");
const yaml = require("node-yaml-config");


const config = yaml.load("config.yml");
const port = config.port; // default port to listen
const app = express();


// Configure Express to use EJS
app.set( "views", path.join( __dirname, "views" ) );
app.use( express.static( path.join( __dirname, "assets" ) ) );
app.set( "view engine", "ejs" );

//Routes
app.use('/', require('./routes/login'));
app.use('/', require('./routes/dashboard'));

// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
} );