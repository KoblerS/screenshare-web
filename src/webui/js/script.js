var dataConn;
var connected = false;
var call;
var stream;
var isPaused = false;

var url = window.location.href;

if (!url.endsWith('index.html') && !url.endsWith('/')) {
  window.location.href = url + '/';
}

$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('connectCode')) {
    let connectCode = urlParams.get('connectCode');
    $('#tx_code').val(connectCode);
  }

  $('.disconnect').click(function () {
    disconnect();
  });

  $('.pause').click(function () {
    if(isPaused) {
      $('.pause').find('.fa').removeClass('fa-eye-slash').addClass('fa-eye');
    } else {
      $('.pause').find('.fa').removeClass('fa-eye').addClass('fa-eye-slash');
    }
    isPaused = !isPaused;
    pauseStream();
  });

  $('#tx_code').on('keyup', function (e) {
    if (e.keyCode === 13) {
      connectPeer();
    }
  });

  setTimeout(function () {
    $('.circle').fadeOut(300);
    $('.loader').animate({ height: '0px' }, 500);
  }, 1000);
});

function startRecording() {
  isPaused = false;
  if (navigator.getDisplayMedia) {
    return navigator.getDisplayMedia({ video: true });
  } else if (navigator.mediaDevices.getDisplayMedia) {
    return navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
  } else {
    return navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } });
  }
}

window.addEventListener('beforeunload', function (e) {
  disconnect();
});

var uuid = uuidv4();

peer = new Peer(uuid, {
  host: 'splitcast.io',
  port: 443,
  path: 'peerserver',
  secure: true
});

peer.on('error', function (error) {
  $('#errorMessage').hide().text('Bei der Verbindung ist ein Fehler aufgetreten!').fadeIn(300);
  this.connected = false;
});

function connectPeer() {
  $('#errorMessage').hide();
  if (connected == true) {
    $('#errorMessage').hide().text('Es ist bereits eine Verbindung hergestellt, bitte trenne diese vorher!').fadeIn(300);
    return;
  }
  const connectCode = $('#tx_code').val();
  if (connectCode == "" | (connectCode > 11111 && connectCode < 9999)) {
    $('#errorMessage').hide().text('Ungültiger Verbindungscode!').fadeIn(300);
    return;
  }
  dataConn = peer.connect(connectCode);
  dataConn.on('open', function () {
    connected = true;
    captureScreen(connectCode);
  });
  dataConn.on('error', function (error) {
    console.error(error);
  });
  dataConn.on('close', function () {
    disconnect();
  });
}

async function captureScreen(connectCode) {
  stream = await startRecording();

  if (!stream)
    return;

  call = peer.call(connectCode, stream);

  $('.backdrop').show();

  call.on('open', function () {
    connected = true;
  });
  call.on('error', function (error) {
    $('#errorMessage').hide().text('Ungültiger Verbindungscode!').fadeIn(300);
    connected = false;
  });
  stream.addEventListener('inactive', e => {
    console.log('ended');
    disconnect();
  });
}

function disconnect() {
  connected = false;
  if (dataConn.open) {
    dataConn.send('closed');
  }
  stopStream();
  $('.backdrop').hide();
  $('#tx_code').val('');
}

function stopStream() {
  const tracks = stream.getTracks();

  tracks.forEach(function (track) {
    track.stop();
  });
}

function pauseStream() {
  const tracks = stream.getTracks();

  tracks.forEach(function (track) {
    track.enabled = !isPaused;
  });
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}