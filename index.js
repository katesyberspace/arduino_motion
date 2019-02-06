// Global variables
let http = require('http');
let express = require('express');
let io = require('socket.io');
let five = require("johnny-five");

// Create board instance
let board = new five.Board();
// Create app instance
let app = new express();

// Set the port number
let port = 3000;

// Set the app instance to read the public directory
// Will find index.html
app.use(express.static(__dirname + '/public'));

// board.on
board.on("ready", function() {
  // Connection message in the console
  console.log('ARDUINO BOARD READY STATE: TRUE');

  // J5 ----- Create a motion sensor instance
  const motion = new five.Motion(7)

  // board.repl.inject({
  //   pot: photoresistor
  // });


  motion.on("calibrated", function(){
    console.log('calibrated')
  })

  motion.on("change", function(){
    console.log('change in motion detection')
  })


  motion.on("motionstart", function(){
    console.log('motionstart')
    io.emit("motion", 50)
  })

  motion.on('motioned', function(){
    console.log('motioned')
  })
  // photoresister.on('data', function(){
    // console.log(photoresister.scaleTo(0,100))
// 
    // SOCKET.IO ---- when the resister gets data, send it to browser via socket
    // io.emit('data', photoresister.scaleTo(0,100))
  // })
});


// Begin 'listening' on the pre defined port number (3000)
const server = http.createServer(app).listen(port, function(req, res){
  console.log('LISTENING ON PORT ' + port);
});

// Set up socket.io to 'listen'
io = io.listen(server);

// Display a conection message
io.on('connection', function(socket){
  console.log('SOCKET.IO CONNECTED');

// Display a disconnection message
  socket.on('disconnect', function(){
    console.log('SOCKET.IO DISCONNECTED');
  })
});