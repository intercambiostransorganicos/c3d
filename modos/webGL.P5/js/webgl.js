//Variables Max
let poseNet;
let poses = [];
let poseX, poseY;
let miBoton = document.querySelector('.empezar');
let opciones = document.querySelector('.selector');
let miSelect = document.querySelector('.misBotones');
let popup = document.querySelector(".popup")
let parte = 0;
let parteCuerpo;
let start = false
let mostrar = false;
let miFuente;

let parameters = {
 imageScaleFactor: 0.3,
 outputStride: 16,
 flipHorizontal: false,
 minConfidence: 0.5,
 maxPoseDetections: 2,
 scoreThreshold: 0.5,
 nmsRadius: 20,
 detectionType: 'single',
 multiplier: 0.75,
}

//Variables Santi
var angle = 0;
let cam;

opciones.addEventListener('change', (event) => {
   parte = parseInt(event.target.value);
   parteCuerpo = event.target[parte+1].innerHTML;
})

function mostrarPop(){
  mostrar = !mostrar;

  if(mostrar){
    popup.style.width = '200px';
    popup.style.opacity = '1';
  } else {
    popup.style.width = '0px';
    popup.style.opacity = '0';
  }
}

function posenetStart() {
  if (!isNaN(parte)) {
    miBoton.style.display = "none";
    miSelect.style.display = "block";
    miSelect.style.placeItems = "unset";
    miSelect.style.top = "60%";
    miSelect.style.left = "75%";
    poseNet = ml5.poseNet(cam, parameters, modelReady);
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
}

function draw() {
  if (start) {
    //Espejado de camara
    translate(cam.width, 0);
    scale(-1, 1);

    drawKeypoints();

    if(poseX != undefined || poseY != undefined){
      let dx = poseX;
      let dy = poseY;
      let mouseColorx = map(poseX, 0, width * 0.7, 0, 255);
      let cursorZ = map(poseY, 0, width * 0.7, 0, 375)
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

      let fov = map(poseX * 3, 0, width, 0, PI);
      let cameraZ = (height / 2) - tan(PI / 3);
      perspective(fov, width / height, cameraZ / 50.0, cameraZ * 50.0);

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

      translate(0, -50, -230);

      noStroke();
      texture(cam);
      plane(650, 600);
      angle += 0.005;
    } else {
      background(0)
    }
  }
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
        }
      }
    }
  }
}
