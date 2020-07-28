//Variables Max
var socket;
let poseNet;
let poses = [];
let poseX, poseY;
let miBoton, opciones;
let parte = 0;
let start = false

//Variables Santi
var angle = 0;
let cam;

function posenetStart() {
  if(opciones.value() != 'Seleccionar...'){
    miBoton.hide();
    opciones.hide();
    poseNet = ml5.poseNet(cam, modelReady);
    poseNet.on('pose', function(results) {
      poses = results;
    });
  }
  start = true;
}


function setup() {
    createCanvas(500, 500, WEBGL);
    cam = createCapture(VIDEO);
    cam.size(150, 175);
    cam.hide();

  //  setupOsc(12000, 3334);

    let miDiv = createDiv()
    miDiv.addClass('selector')

    miBoton = createButton('Empezar');
    miBoton.mousePressed(posenetStart);

    opciones = createSelect();
    opciones.option('Seleccionar...')
    opciones.option('nariz')
    opciones.option('mano izquierda')
    opciones.option('mano derecha')
    opciones.changed(cambioDeteccion)

    miDiv.child(opciones)
    miDiv.child(miBoton)

}

function cambioDeteccion() {
  let val = opciones.value();
  switch (val) {

    case 'nariz':
      parte = 0;
      break;

    case 'mano izquierda':
      parte = 9;
      break;

    case 'mano derecha':
      parte = 10;
      break;

    default:
      parte = 0;
      break;
  }
}

function draw() {
  if(start){
    //Espejado de camara
    translate(cam.width, 0);
    scale(-1, 1);

    drawKeypoints();

    let dx = poseX - width / 2;
    let dy = poseY - height / 2;
    let mouseColorx = map(poseX, 0, width, 0, 255);
    let cursorZ = map(poseY, 0, width, 0, 375)
    let v = createVector(dx, dy, 0);
    v.div(100);

    ambientLight(255, 100, 50)
    directionalLight(255, 0, 255, dx, dy, 0);
    pointLight(0, 0, 255, 500, 0, 0);
    pointLight(0, 255, 0, 0, 200, 0);
    pointLight(0, 255, 0, 0, -200, 0);
    pointLight(255, mouseColorx, 100, 0, 0, 200);

    background(0);

    translate(0, 0, cursorZ);

    let fov = map(poseX, 0, width, 0, PI);
    let cameraZ = (height / 2) - tan(PI / 3);
    perspective(fov, width / height, cameraZ / 10.0, cameraZ * 10.0);

    push();
    rotateX(angle);
    rotateY(angle * 0.2);
    rotateZ(angle * 0.2);

    noStroke();

    texture(cam);

    box(220);
    box(50);
    box(20);
    box(8);
    box(3);
    box(1);
    pop();

    push();
    translate(0, 250, 100);
    rotateX(HALF_PI);

    noStroke();
    texture(cam);
    plane(650, 600);
    pop();

    push();
    translate(0, -350, 100);
    rotateX(HALF_PI);

    noStroke();
    texture(cam)
    plane(650, 600);
    pop();

    push();
    translate(330, -50, 100);
    rotateY(HALF_PI);
    texture(cam);
    noStroke();
    plane(650, 600);
    pop();

    push();
    translate(-330, -50, 100);
    rotateY(HALF_PI);
    texture(cam);
    noStroke();
    plane(650, 600);
    pop();

    translate(0 , -50 , -230);

    noStroke();
    texture(cam);
    plane(650, 600);
    angle += 0.005;
  }
}


function setupOsc(oscPortIn, oscPortOut) {
  socket = io.connect('http://127.0.0.1:8081', {
    port: 8081,
    rememberTransport: false
  });
  socket.on('connect', function() {
    socket.emit('config', {
      server: {
        port: oscPortIn,
        host: '127.0.0.1'
      },
      client: {
        port: oscPortOut,
        host: '127.0.0.1'
      }
    });
  });
  socket.on('message', function(msg) {
    if (msg[0] == '#bundle') {
      for (var i = 2; i < msg.length; i++) {
        receiveOsc(msg[i][0], msg[i].splice(1));
      }
    } else {
      receiveOsc(msg[0], msg.splice(1));
    }
  });
}


function modelReady() {
  console.log('model ready');
}

function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < min(poses.length, 1); i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        //Muñeca izquierda
        if (j == parte) {
          poseX = keypoint.position.x;
          poseY = keypoint.position.y;

          // socket.emit('message', [poseX, poseY]);
        }
      }
    }
  }
}
