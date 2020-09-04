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
let bubbles = [];
let start = false;

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
  opciones.style.display = "none";
  empezarMouse.style.display = "none";

  let sketchPose = function(p) {
    p.setup = function() {
      p.cnv = p.createCanvas(window.innerWidth, window.innerHeight)
      p.cnv.style('pointer-events', 'none')
      video = p.createCapture(p.VIDEO);
      video.size(p.width, p.height)
      video.hide();

      for (let i = 0; i < 50; i++) {
        bubbles.push(new Bubble(i, p));
      }
    }

    p.draw = function() {
      p.translate(p.width,0)
      p.scale(-1, 1);
      if (mostrarVideo) {
        p.image(video, p.width - 320, 0, 320, 240);
      }

      if (start) {
        p.clear()

        for (var i = 0; i < bubbles.length; i++) {
          bubbles[i].display();
          bubbles[i].move();
        }

        drawKeypoints(p);
      }
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
      p.cnv = p.createCanvas(window.innerWidth, window.innerHeight, )
      p.cnv.style('pointer-events', 'none')
      for (let i = 0; i < 100; i++) {
        bubbles.push(new Bubble(i, p));
      }
    }

    p.draw = function() {
      p.clear()

      for (var i = 0; i < bubbles.length; i++) {
        bubbles[i].display();
        bubbles[i].move();
      }
    }

    p.mousePressed = function() {
      for (let i = 0; i < bubbles.length; i++) {
        if (bubbles[i].poke(p.mouseX, p.mouseY)) {
          bubbles.splice(i, 1);
        }
      }
    }

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  }

  let myp5 = new p5(sketchMouse);
}

function modelReady() {
  console.log('model ready');
  start = true;
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

          p.fill(255)
          p.noStroke()
          p.circle(poseX,poseY,30)

          for (let i = 0; i < bubbles.length; i++) {
            if (bubbles[i].poke(poseX, poseY)) {
              bubbles.splice(i, 1);
            }
          }
        }
      }
    }
  }
}


function Bubble(i, p) {

  this.r = (Math.random()* (35)+15);
  this.posX = i + 104.3 + 14.6;
  this.posY = i + 53.3 + 35.2;
  this.time = p.millis() / 1000;
  this.ampX = p.width;
  this.ampY = p.height;
  this.speed = 0.1;

  // Determina X e Y de las burbujas usando Perlin Noise
  this.x = this.ampX - p.width/2//* p.noise(this.time * this.speed + this.posX);
  this.y = this.ampY - p.height/2//* p.noise(this.time * this.speed + this.posY);


  this.speedX = Math.random();
  this.speedX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
  this.speedY = Math.random();
  this.speedY *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

  this.display = function() {
    p.stroke(50, 150, 255);
    p.strokeWeight(1);
    p.fill(0, 200, 255, 50);
    p.ellipse(this.x, this.y, this.r, this.r);
  }

  this.move = function() {

    if (this.x < 0) {
      this.x = 0;
      this.speedX *= -1;
    } else if (this.x > p.width) {
      this.x = p.width;
      this.speedX *= -1;
    }

    if (this.y < 0) {
      this.y = 0;
      this.speedY *= -1;
    } else if (this.y > p.height) {
      this.y = p.height;
      this.speedY *= -1;
    }


    this.x += this.speedX
    this.y += this.speedY;
  }

  this.poke = function(nX, nY) {
    if (nX > (this.x - this.r / 2) &&
      nX < (this.x + this.r / 2) &&
      nY > (this.y - this.r / 2) &&
      nY < (this.y + this.r / 2)) {
      return true;
    } else {
      return false;
    }

  }
}
