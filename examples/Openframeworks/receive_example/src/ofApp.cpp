#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
    ofSetWindowTitle("Receive OSC");
    ofSetFrameRate(60); // run at 60 fps
    ofSetVerticalSync(true);
    
    // listen on the given port
    ofLog() << "Recibiendo Mensajes en el puerto " << PORT;
    receiver.setup(PORT);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    // hide old messages
    for(int i = 0; i < NUM_MSG_STRINGS; i++){
        if(timers[i] < ofGetElapsedTimef()){
            msgStrings[i] = "";
        }
    }
    
    // check for waiting messages
    while(receiver.hasWaitingMessages()){
        
        // get the next message
        ofxOscMessage m;
        receiver.getNextMessage(m);
        
        // check for mouse moved message
        if(m.getAddress() == "/poses/0/keypoints/nose/"){
            
            // both the arguments are floats
            mouseXf = m.getArgAsFloat(0);
            mouseYf = m.getArgAsFloat(1);
        } else{
            
            // unrecognized message: display on the bottom of the screen
            string msgString;
            msgString = m.getAddress();
            msgString += ":";
            for(size_t i = 0; i < m.getNumArgs(); i++){
                
                // get the argument type
                msgString += " ";
                msgString += m.getArgTypeName(i);
                msgString += ":";
                
                // display the argument - make sure we get the right type
                if(m.getArgType(i) == OFXOSC_TYPE_INT32){
                    msgString += ofToString(m.getArgAsInt32(i));
                }
                else if(m.getArgType(i) == OFXOSC_TYPE_FLOAT){
                    msgString += ofToString(m.getArgAsFloat(i));
                }
                else if(m.getArgType(i) == OFXOSC_TYPE_STRING){
                    msgString += m.getArgAsString(i);
                }
                else{
                    msgString += "unhandled argument type " + m.getArgTypeName(i);
                }
            }
            
            // add to the list of strings to display
            msgStrings[currentMsgString] = msgString;
            timers[currentMsgString] = ofGetElapsedTimef() + 5.0f;
            currentMsgString = (currentMsgString + 1) % NUM_MSG_STRINGS;
            
            // clear the next line
            msgStrings[currentMsgString] = "";
        }
    }
}


//--------------------------------------------------------------
void ofApp::draw(){
    
    ofBackgroundGradient(100, 0);
    
    // if image exists, draw it
    if(receivedImage.getWidth() > 0){
        ofSetColor(255);
        receivedImage.draw(ofGetWidth()/2 - receivedImage.getWidth()/2,
                           ofGetHeight()/2 - receivedImage.getHeight()/2);
    }
    
    // draw recent unrecognized messages
    for(int i = 0; i < NUM_MSG_STRINGS; i++){
        ofDrawBitmapStringHighlight(msgStrings[i], 10, 40 + 15 * i);
    }
    
    string buf = "listening for osc messages on port " + ofToString(PORT);
    ofDrawBitmapStringHighlight(buf, 10, 20);
    
    // draw mouse state
    glm::vec3 mouseIn(mouseXf, mouseYf,0);
    
    ofSetColor(ofColor::salmon);
    ofDrawCircle(mouseIn, 20);
    ofDrawBitmapStringHighlight(mouseButtonState, mouseIn);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){
    
}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y){
    
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){
    
}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){
    
}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){
    
}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){
    
}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){
    
}
