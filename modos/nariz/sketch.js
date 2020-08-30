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

  let sketchPose = function(p) {
    p.setup = function() {
      p.cnv = p.createCanvas(window.innerWidth, window.innerHeight)
      p.cnv.style('pointer-events', 'none')
      video = p.createCapture(p.VIDEO);
      video.size(p.width, p.height)
      video.hide();
      p.pg = p.createGraphics(p.width, p.height);
    }

    p.draw = function() {
      if (mostrarVideo) {
        p.image(video, p.width - 320, 0, 320, 240);
      }
      p.translate(video.width, 0);
      p.scale(-1, 1);
      p.image(p.pg, 0, 0, p.width, p.height);
      drawKeypoints(p);
    }

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  }

  let myp5 = new p5(sketchPose);

  poseNet = ml5.poseNet(video, parameters, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
}

function mouseStart() {
  empezarMouse.style.display = "none";
  empezarPose.style.display = "none";
  switchMouse = true;

  let sketchMouse = function(p) {
    p.setup = function() {
      p.cnv = p.createCanvas(window.innerWidth, window.innerHeight)
      p.cnv.style('pointer-events', 'none')
      p.pg = p.createGraphics(p.width, p.height);
    }

    p.draw = function() {
      if (dibujar) {
        p.pg.stroke(miColor);
        p.pg.strokeWeight(5);
        p.pg.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
        p.image(p.pg, 0, 0, p.width, p.height);
      }
    }

    p.keyPressed = function(e) {
      p.pg.clear();
      p.clear();
    }

    p.mousePressed = function() {
      dibujar = true;
    }

    p.mouseReleased = function() {
      dibujar = false;
    }

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  }

  let myp5 = new p5(sketchMouse);
}

function modelReady() {
  console.log('model ready');
}

function drawKeypoints(p) {
  // Loop through all the poses detected
  for (let i = 0; i < p.min(poses.length, 1); i++) {
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

          p.pg.stroke(miColor);
          p.pg.strokeWeight(5);
          p.pg.line(poseX, poseY, nPoseX, nPoseY);

          nPoseX = poseX;
          nPoseY = poseY;
        }
      }
    }
  }
}
