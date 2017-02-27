/* Meant to run on Processing 3

   This small program took care of presenting animations for Axis Mundi's visual 
   support. It first loads the image sequences then displays the according to the
   currently selected scene. 
   
   How to use:
   - Launch the program and wait for the images to load. Progress is indicated in
     the console.
   - Press any key to step through the scenes
   
   That's it!
   Simon

*/

seq wave;
seq tree;
seq fin;

int PreResizeX = 960;
int PreResizeY = 0;

void setup() {
  background(0);
  frameRate(60);
  size(960, 540);

  
  wave = new seq(1, 59, "wave/",".jpg");
  tree = new seq(412, 433, "tree/",".jpg");
  fin = new seq(1, 20, "fin/",".jpg");
  println("% done");
  println("* press any key to step through scenes");
  println("* scene " + step);
  
  wave.setPos(0, int((height-wave.height)));
  fin.setPos(0, int((height-fin.height)));
}

void draw() {
  background(0);
  wave.draw();
  tree.draw();
  fin.draw();
}

void keyPressed() {
  step++;
  step();
}

int step = -1;

void step() {
  println("* scene " + step);
  if(step == 0) {
    tree.setLoop(1400);
    tree.fadeIn(1400);
  }
  else if(step == 1) {
    tree.fadeOut(400);
  }
  else if(step == 2) {
    wave.setLoop(900);
    wave.fadeIn(800);
  }
  else if(step  == 3) {
    wave.fadeOut(1200);
  }
  else if(step == 4) {
    fin.setLoop(1000);
    fin.fadeIn(4000);
  }
  else if(step == 5) {
    fin.fadeOut(12000);
  }
}

class seq {
  public int firstFrame, lastFrame, numFrames, width, height, x = 0, y = 0;
  public PImage[] frame;
  
  seq(int tmpfirstFrame, int tmplastFrame, String path, String extension) {
    firstFrame = tmpfirstFrame; 
    lastFrame = tmplastFrame;
    numFrames = lastFrame - firstFrame + 1;
    String framepath = "";
    
    frame = new PImage[numFrames];
    for(int i = 0; i < numFrames; i++) {
      framepath = path+nf(i + firstFrame, 4, 0)+extension;
      frame[i] = loadImage(framepath);
      frame[i].resize(PreResizeX, PreResizeY); //global resize for this sketch
      println("% loading " + framepath);
    }
    width = frame[0].width;
    height = frame[0].height;
  }
  
  public boolean active, looping, fading;  
  
  float floatFrame, blend, bright, alpha = 0, alphaIncr;
  int loopTime, leadFrame, lagFrame;
  
  void draw() {
    if(looping == true) {
      floatFrame = millis()*1.0/loopTime*1.0;
      lagFrame = floor(floatFrame);
      leadFrame = lagFrame + 1;
      blend = floatFrame - lagFrame*1.0;
    }
    if(fading == true) {
      alpha = constrain(alpha*1.0 + alphaIncr*1.0, 0, 1);
    }
    if(active == true) {
      
      //lag frame
      tint(255, 255*(1-blend)/(1/alpha-blend));
      image(frame[lagFrame%numFrames], x, y);
      //print("$ lag   " +  nf(lagFrame%numFrames + firstFrame, 4, 0));
      
      //lead frame
      tint(255, 255*blend*alpha);
      image(frame[leadFrame%numFrames],x ,y);
      //println("$ lead " +  nf(leadFrame%numFrames + firstFrame, 4, 0));
    }
    if(alpha == 0 && alphaIncr < 0) { //runs when fadeOut ends
      fading = false;
      looping = false; //disables looping
    }
    if(alpha == 1 && alphaIncr > 0) { //runs when fadeOut ends
      fading = false;
    }
    if(looping == false && fading == false) { 
      active = false; 
    }
    else {
      active = true;
    }
  }
  
  void setLoop(int tmploopTime) {
    looping = true;
    loopTime = tmploopTime;
  }
  
  void setPos(int tmpx, int tmpy) {
    x = tmpx;
    y = tmpy;
  }
  
  void fadeIn(int tmpfadeTime) {
    alphaIncr = 1.0/(tmpfadeTime*1.0/1000)/(frameRate*1.0);
    fading = true;
  }
  
  void fadeOut(int tmpfadeTime) {
    alphaIncr = -1.0/(tmpfadeTime*1.0/1000)/(frameRate*1.0);
    fading = true;
  }
  /*
  void setFrame(int frame) {
    //unimplemented
  }
  
  void setNext() {
    //unimplemented
  }
  
  void setPrev() {
    //unimplemented
  }
  void fadeNext(int time) {
    //unimplemented
  }
  
  void fadePrev(int time) {
    //unimplemented
  }
  */ 
}