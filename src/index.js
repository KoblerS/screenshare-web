const express = require('express'),
  https = require('https'),
  fs = require('fs'),
  { PeerServer } = require('peer');

const expressApp = express(),
  peerServer = PeerServer({ 
    port: 9000, 
    path: '/peerserver',
    ssl: {
      key: fs.readFileSync(__dirname + '/certs/server.key'),
      cert: fs.readFileSync(__dirname + '/certs/server.cert')
    }
  });


https.createServer({
  key: fs.readFileSync(__dirname + '/certs/server.key'),
  cert: fs.readFileSync(__dirname + '/certs/server.cert')
}, expressApp).listen(443, () => {
  console.log('Listening...');
  console.log('Server started');
});

expressApp.use(express.static(__dirname + '/webui'));