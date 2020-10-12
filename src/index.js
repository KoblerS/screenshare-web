const express = require('express'),
  { PeerServer } = require('peer');

const expressApp = express(),
  peerServer = PeerServer({ 
    port: 9000, 
    path: '/peerserver/'
  });


expressApp.listen(8000, () => {
  console.log('Listening...');
  console.log('Server started');
});

expressApp.use(express.static(__dirname + '/webui'));