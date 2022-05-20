let video;
let poseNet;
let poses = [];
let poseX, poseY, nPoseX, nPoseY;
let miBoton = document.querySelector('.empezar');
let popup = document.querySelector(".popup")
let parte = 0;
let pg;
let colorPicker
let mostrar = false;
let mostrarVideo = false;

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
  mostrar = !mostrar;

  if (mostrar) {
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

function posenetStart() {
  miBoton.style.display = "none";
  poseNet = ml5.poseNet(video, parameters, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  start = true;
}

function setup() {
  let cnv = createCanvas(window.innerWidth, window.innerHeight)
  cnv.style('pointer-events', 'none')

  pixelDensity(1);
  pg = createGraphics(width, height);

  colorPicker = createColorPicker('#ed225d');
  colorPicker.position(width - 150, height - 50);

  video = createCapture(VIDEO);
  video.size(width, height)
  video.hide();
}


function draw() {
  push()
  pixelDensity(3.0)
  textSize(15)
  fill(50, 50, 50, 150)
  text('Color', width - 145, height - 16)
  pop()
  translate(video.width, 0);
  scale(-1, 1);

  if (mostrarVideo) {
    image(video, 0, 0, 320, 240);
  }

  image(pg, 0, 0, width, height);
  drawKeypoints();
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

          pg.stroke(colorPicker.value());
          pg.strokeWeight(5);
          pg.line(poseX, poseY, nPoseX, nPoseY);

          nPoseX = poseX;
          nPoseY = poseY;

          if (mostrarVideo) {
            fill(255, 0, 0);
            noStroke();
            let nX = map(keypoint.position.x, 0, width, width - 320, width)
            let nY = map(keypoint.position.y, 0, height, height - 240, height)
            ellipse(nX - width / 2 - 320, nY - height / 2 - 80, 10, 10);
          }
        }
      }
    }
  }
}

function keyPressed() {
  pg.clear();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
