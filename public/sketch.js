function setup() {
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL)
  cnv.position(0, 0)
  cnv.style('pointer-events', 'none')
}

function draw() {
  clear()
  translate(width * 0.35, -130)
  rotateX(((-mouseY) * 50 + millis()) / 5000)
  rotateY(((-mouseX) * 50 + millis() * 2) / 7000)
  noFill()
  stroke(255, 150)
  sphere(100, 24)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
