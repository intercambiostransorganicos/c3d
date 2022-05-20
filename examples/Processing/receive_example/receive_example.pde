//Imporamos las libreras de OSC
import oscP5.*;
import netP5.*;

//El x e y de nuestra parte del cuerpo detectada
float x, y, x1, y1;

//Creo los objetos de las librerias
OscP5 oscP5;
NetAddress myRemoteLocation;

void setup() {
  size(640, 480);
  // Seteamos el puerto en el que se recibe la data de la web 
  oscP5 = new OscP5(this, 3334);
}


void draw() {
  background(0);
  //Dibujamos un circulo blanco
  fill(255);
  ellipse(x, y, 100, 100);
  fill(0);
  text("I'm Processing", x-40, y);

  ellipse(x1, y1, 100, 100);
  fill(0);
  text("I'm Processing2", x-40, y1);
}

//Aca se recibe la data de OSC
void oscEvent(OscMessage theOscMessage) {
  //Nariz
  if (theOscMessage.checkAddrPattern("/poses/0/keypoints/nose/")==true) {
    x = theOscMessage.get(0).floatValue();
    y = theOscMessage.get(1).floatValue();
  }

  //Ojo Izquierdo: /poses/0/keypoints/leftEye/
  //Ojo Derecho: /poses/0/keypoints/rightEye/
  //Oido Izquierdo: /poses/0/keypoints/leftEar/
  //Oido Derecho: /poses/0/keypoints/rightEar/
  //Hombro Izquierdo: /poses/0/keypoints/leftShoulder/
  //Hombro Derecho: /poses/0/keypoints/rightShoulder/
  //Codo Izquierdo: /poses/0/keypoints/leftElbow/
  //Codo Derecho: /poses/0/keypoints/rightElbow/
  //Muñeca Izquierda: /poses/0/keypoints/leftWrist/
  //Muñeca Derecha: /poses/0/keypoints/rightWrist/
  //Cadera Izquierda: /poses/0/keypoints/leftHip/
  //Cadera Derecha: /poses/0/keypoints/rightHip/
  //Rodilla Izquierda: /poses/0/keypoints/leftKnee/
  //Rodilla Derecha: /poses/0/keypoints/rightKnee/
  //Tobillo Izquierdo: /poses/0/keypoints/leftAnkle/
  //Tobillo Derecho: /poses/0/keypoints/rightAnkle/
}
