/* Meant to run on Processing 3

   This sketch is an exploration of means of creating glitched and broken images. 
   Each pixel's color is set by grabbing the color of a few surrounding pixels, 
   treating them as 32bit data, then applying boolean operators or multiplication 
   to them. As the surrounding pixels' colors are taken from the currently ongoing
   iteration, feedback occurs, creating patterns, stripes and gradients.
   
   How to use:
   - Click and drag to move the offset amount of the surrounding pixels
   - Use the up/down arrow keys to change the pattern used for pixel selection. 
     There are 4 different patterns. This changes the effect of dragging and 
     interacts with feedback behaviour.
   - Use the left/right arrow keys to change the algorithm applied on the set of
     pixels. There are 4 different algorithms. This largely determines the 
     features of the image.
     
   The sketch will be blank on load; click and drag around until you see something. 
     
   Have fun!
   Simon
*/

PImage myImageInit;
PImage myImage;

float floatvarX = 0;
float floatvarY = 0;
float incrementunitX = 0.1;
float incrementunitY = 0.1;

int intvarX = 0;
int intvarY = 0;

int arrowvarX = 0;
int arrowvarY = 0;
int arrowvarXmin = 0;
int arrowvarXmax = 3;
int arrowvarYmin = 0;
int arrowvarYmax = 3;

String filepath = "g2.JPG";

void setup() {  
  //frameRate(45);
  myImage = loadImage(filepath);
  surface.setResizable(true);
  surface.setSize(myImage.width, myImage.height);
  
  //line = new color[myImage.width];
  //lineindex = new int[myImage.width];
  
  redraw();
}  

color c;
color c1;
color c2;
color c3;
color c4;

void redraw() {
  myImage = loadImage(filepath);
  c1 = 0;
  c2 = 0;
  c3 = 0;
  c4 = 0;
  
  for (int h = 0; h < myImage.height; h++) {
    for(int w = 0; w < myImage.width; w++) {
      switch(arrowvarY) {
        case 1:
          c1 = myImage.get(w, h + intvarY + 1);
          c2 = myImage.get(w - intvarX - 1, h);
          c3 = myImage.get(w + intvarX, h);
          c4 = myImage.get(w + intvarX, h - intvarY);
          break;
        case 2:
          c1 = myImage.get(w, h - intvarY + 1);
          c2 = myImage.get(w - intvarX - 1, h);
          c3 = myImage.get(w - intvarX, h);
          c4 = myImage.get(w + intvarX, h - intvarY);
          break;
        case 3:
          c1 = myImage.get(myImage.width - w, h - intvarY + 1);
          c2 = myImage.get(w - intvarX - 1, h);
          c3 = myImage.get(w - intvarX, h);
          c4 = myImage.get(w + intvarX, h - intvarY);
          break;
        default:
          c1 = myImage.get(w, h + intvarY + 1);
          c2 = myImage.get(w - intvarX - 1, h);
          c3 = myImage.get(w - intvarX, h);
          c4 = myImage.get(w + intvarX, h + intvarY);
          break;
      }
      switch(arrowvarX) {
        case 1:
          c = (c1 + c2) ^ int(c2*floatvarX) | c4;
          break;
        case 2:
          c = c1 | int(c2*floatvarX) ^ c3;
          break;
        case 3:
          c = (c1 & int(c3*floatvarX)) ^ c4 + c2;
          break;
        default:
          c = (c1 & c3 ) ^ c4 + c2;
          break;
      }
      myImage.set(w, h, c);
    }
  }
  myImage.updatePixels();
  image(myImage, 0, 0);
}

boolean dragvar;
boolean shiftmode;

int lastX;
int lastY;

int initmouseX;
int initmouseY;

//int counter1 = 0;

int tempmouseX;
int tempmouseY;

void draw() {
  if(mouseX != lastX | mouseY != lastY) {
    lastX = mouseX;
    lastY = mouseY;
  }
  else {
    return;
  }
  
  if(dragvar == true) {
    tempmouseX = mouseX;
    tempmouseY = mouseY;
    
    floatvarX = floatvarX + ((mouseX-initmouseX)*incrementunitX);
    floatvarY = floatvarY + ((mouseY-initmouseY)*incrementunitY);
    intvarX += mouseX-initmouseX;
    intvarY += mouseY-initmouseY;
    
    /*if(shiftmode == true) {
      floatvarX = floatvarX + ((mouseX-initmouseX)*incrementunitX);
      floatvarY = floatvarY + ((mouseY-initmouseY)*incrementunitY);
    }
    else {
      intvarX += mouseX-initmouseX;
      intvarY += mouseY-initmouseY;
    }*/
    redraw();
    
    initmouseX = tempmouseX;
    initmouseY = tempmouseY;
  }
}

void mousePressed() {
  dragvar = true;
  initmouseX = mouseX;
  initmouseY = mouseY;
}

void mouseReleased() {
  dragvar = false;
}

void keyPressed() {
  if(key == CODED)  {
    if(keyCode == UP && arrowvarY < arrowvarYmax) {
      arrowvarY++;
      redraw();
      println("arrowvarY " + arrowvarY);
    }
    else if(keyCode == DOWN  && arrowvarY > arrowvarYmin) {
      arrowvarY--;
      redraw();
      println("arrowvarY " + arrowvarY);
    }
    else if(keyCode == RIGHT && arrowvarX < arrowvarXmax) {
      arrowvarX++;
      redraw();
      println("arrowvarX " + arrowvarX);
    }
    else if(keyCode == LEFT && arrowvarX > arrowvarXmin) {
      arrowvarX--;
      redraw();
      println("arrowvarX " + arrowvarX);
    }
    else if(keyCode == SHIFT) {
      shiftmode = true;
    }
    else {
      return;
    }
    redraw();
  }
}

void keyReleased() {
  if(keyCode == SHIFT) {
    shiftmode = false;
  }
}