
// establish unique namespace
let socket = io('/private');

// create input for user to enter room name in a window prompt
window.addEventListener('load', () => {
  let roomName = window.prompt('Enter room name: ');
  console.log(roomName);

  // ping server with room name
  socket.emit('room-name', {room: roomName});
})

// listen for confirmation of connection
socket.on('connect', function() {
  console.log("connected");
});

// listen & log welcome message
socket.on('joined', (data) => {
  console.log(data.msg);
})

// button event listener
let inputForm = document.getElementById('boardInput');
let sendButton = document.getElementById('boardButton');

sendButton.addEventListener('click', ()=> {
  let inputText = inputForm.value;
 

  // send text from post-it note to the server
  socket.emit('data', inputText);
  inputValue(inputText);
})

/*---- p5 ----*/
    // let winWidth;
    // let winHeight;
    
var inp;
var btn;
let note;
let testNote = "Test note";

function setup() {
//   winWidth = windowWidth *0.85;
//   winHeight = windowHeight *0.85;
  const myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent('container');
  background(169, 118, 82);
  rectMode(CENTER);
  fill(197, 145, 108);
  noStroke();
  rect(windowWidth/2, windowHeight/2, windowWidth-50, windowHeight-50)
  loadImage ('/assets/calendar.png', img => {
    image(img, 50, 50, windowWidth*0.25, windowHeight*0.75);
  })

  // text input
  inp =  createInput('type your plan for Summer in Shanghai');
  inp.position(33, windowHeight-100);
  inp.size(windowWidth/3.75);
  
  
  // button
  btn = createButton('submit plan idea');
  btn.position(33, windowHeight - 60);
  btn.mousePressed(inputValue(testNote));
  

  // listen for messages named 'data' from the server
  socket.on('data', function(_note) {
    console.log(_note);
    inputValue(_note);
    // Note(_note);
  })
}

function inputValue(_inputText) {
  console.log(_inputText);

  // create post-it note object
  fill(random(255), random(255), random(255));
  text(_inputText, random(400, windowWidth - 80), random(25, windowHeight - 25));
  // rectMode(CORNER);
  // rect(random(400, windowWidth - 80), random(25, windowHeight - 25), 100, 50);

  // send text from post-it note to the server
  // socket.emit('data', _inputText);
}

/*-- end p5 --*/ 