'use strict';

import path from 'path'
import express from 'express'
import http from 'http';
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import onLoad from '../js/log4us';


global.log4us = onLoad;


const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, '../html/index.html'),
            compiler = webpack(config)

const PORT = process.env.PORT || 8090;
const LISTEN_PORT = process.env.LISTEN_PORT || 1617;

//Refreshes webpage automatically
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))



global.log4us.print("AVIB App started.");
/*
let server= net.createServer(function (client) {
    global.log4us.log("Client connected to server.");
    //client.write("Probando 1..2..3..\n");
    client.on('data', function (data) {
        global.log4us.print(`Received from IDE: ${data.toString()}`);
        //here
        //client.write(data);

        //client.end();
    });

    process.stdin.on('data',function(values){
      client.write(values);
      global.log4us.print(`SEND : ${values}`);
    });


    app.get('/ajaxcall', function(req, res){
      client.write("Method%mult\n");
      global.log4us.print("mult\n");
      //res.send(data);
      //res.send("mult\n");
    });

    client.on('close', function(data) { // closed connection
      global.log4us.log('Client disconnected.'); });

    client.on('error', (err) => {
      global.log4us.err(err);
    });

    client.pipe(client);
});

let client = net.connect({port: 1617}, function() {
   global.log4us.log('Connected to server.');  
});

client.on('data', function(data) {
   global.log4us.print(data.toString());
});

client.on('end', function() { 
   global.log4us.log('Disconnected from server');
});

client.on('error',function(err){
  global.log4us.error(err);
});

process.stdin.on('data',function(values){
  client.write(values);
  global.log4us.print(`Sending: ${values}`);
});
*/
http.createServer(app).listen(PORT, () => {
  global.log4us.print(`Server started at http://localhost:${PORT}`);
});

/*
server.listen(LISTEN_PORT);
global.log4us.print(`App listening on port: ${LISTEN_PORT}`);
*/
