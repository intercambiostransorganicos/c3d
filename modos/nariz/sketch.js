let video;
let poseNet;
let poses = [];
let poseX, poseY, nPoseX, nPoseY;
let empezarPose = document.querySelector('.empezarPose');
let empezarMouse = document.querySelector('.empezarMouse');
let popup = document.querySelector(".popup")
let colorPicker = document.querySelector('#colorPicker')
let miColor = '#ff0000';
let parte = 0;
let pg;
let mostrarAyuda = false;
let mostrarVideo = false;
let switchMouse = false;
let dibujar = false;

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

function mostrarPop() {
  mostrarAyuda = !mostrarAyuda;

  if (mostrarAyuda) {
    popup.style.width = '200px';
    popup.style.opacity = '1';
  } else {
    popup.style.width = '0px';
    popup.style.opacity = '0';
  }
}

function switchOn() {
  mostrarVideo = !mostrarVideo;
}

colorPicker.addEventListener('change', function(event) {
  miColor = event.target.value;
  console.log(miColor);
})

function posenetStart() {
  empezarPose.style.display = "none";
  empezarMouse.style.display = "none";
  poseNet = ml5.poseNet(video, parameters, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
}

function mouseStart() {
  empezarMouse.style.display = "none";
  empezarPose.style.display = "none";
  switchMouse = true;
}

function setup() {
  let cnv = createCanvas(window.innerWidth, window.innerHeight)
  cnv.style('pointer-events', 'none')

  pg = createGraphics(width, height);

  video = createCapture(VIDEO);
  video.size(width, height)
  video.hide();
}


function draw() {
  if (mostrarVideo) {
    image(video, width-320, 0, 320, 240);
  }

  if (!switchMouse) {
    translate(video.width, 0);
    scale(-1, 1);
    image(pg, 0, 0, width, height);
    drawKeypoints();
  } else {
    if (dibujar) {
      pg.stroke(miColor);
      pg.strokeWeight(5);
      pg.line(mouseX, mouseY, pmouseX, pmouseY);
      image(pg, 0, 0, width, height);
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
        //Aca se elige con que parte del cuerpo se controla el sketch
        if (j == 0) {
          poseX = keypoint.position.x;
          poseY = keypoint.position.y;

          pg.stroke(miColor);
          pg.strokeWeight(5);
          pg.line(poseX, poseY, nPoseX, nPoseY);

          nPoseX = poseX;
          nPoseY = poseY;
        }
      }
    }
  }
}

function mousePressed(){
  dibujar = true;
}

function mouseReleased(){
  dibujar = false;
}

function keyPressed(e) {
  pg.clear();
  clear();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
