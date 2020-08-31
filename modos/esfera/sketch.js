let video;
let poseNet;
let poses = [];
let poseX, poseY;
let empezarPose = document.querySelector('.empezarPose');
let empezarMouse = document.querySelector('.empezarMouse');
let popup = document.querySelector(".popup")
let opciones = document.querySelector('.selector');
let parte = 0;
let parteCuerpo;
let mostrarAyuda = false;
let mostrarVideo = false;
let switchMouse = false;

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

opciones.addEventListener('change', (event) => {
  parte = parseInt(event.target.value);
  parteCuerpo = event.target[parte + 1].innerHTML;
})

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

function posenetStart() {
  // if (!isNaN(parte)) {
  opciones.style.display = "none";
  empezarMouse.style.display = "none";

  let sketchPose = function(p) {
    p.setup = function() {
      p.cnv = p.createCanvas(window.innerWidth, window.innerHeight,p.WEBGL)
      p.cnv.style('pointer-events', 'none')
      video = p.createCapture(p.VIDEO);
      video.size(p.width, p.height)
      video.hide();
      // p.pg = p.createGraphics(p.width, p.height);
    }

    p.draw = function() {
      if (mostrarVideo) {
        console.log('cam');
        p.image(video, p.width - 320, 0, 320, 240);
      }

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
  opciones.style.display = "none";
  switchMouse = true;

  let sketchMouse = function(p) {
    p.setup = function() {
      p.cnv = p.createCanvas(window.innerWidth, window.innerHeight,p.WEBGL)
      p.cnv.style('pointer-events', 'none')
    }

    p.draw = function() {
      let colorX = p.map(p.mouseX,0,p.width,0,255)
      let colorY = p.map(p.mouseY,0,p.height,0,255)

     p.clear()
      p.translate(p.mouseX - p.width / 2, p.mouseY - p.height / 2)
      p.rotateY(p.mouseY / 2)
      p.rotateX(p.mouseX / 2)

      p.noFill()
      p.stroke(colorX, colorY, colorX/2 + colorY/2, 255)
      p.sphere(100, 24)
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
        if (j == parte) {
          poseX = keypoint.position.x;
          poseY = keypoint.position.y;
          let colorX = p.map(poseX,0,p.width,0,255)
          let colorY = p.map(poseY,0,p.height,0,255)
          p.scale(-1, 1);
          p.clear()
          p.translate(poseX-p.width/2, poseY-p.height/2)
          p.rotateY(poseY/2)
          p.rotateX(poseX/2)
          p.noFill()

          p.stroke(colorX,colorY,colorX/2 + colorY/2, 150)
          p.sphere(100, 24)
        }
      }
    }
  }
}
