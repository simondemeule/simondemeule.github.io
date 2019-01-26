// written by Simon Demeule

window.onload = function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var frame;
    var orbA = new Array();
    var orbGroupA;
    var orbB = new Array();
    var orbGroupB;
    var orbC = new Array();
    var orbGroupC;
    var iterator;

    function init() {
        canvas.width = document.body.clientWidth; 
        canvas.height = document.body.clientHeight;
        for (iterator = 0; iterator < 2; iterator++) {
            orbA.push(new orb());
        }
        orbGroupA = new orbGroup(orbA);
        orbGroupA.fillType = 'background';
        orbGroupA.sampleSelf = true;
        orbGroupA.filter = 'blur(6px)';
        orbGroupA.fillType = 'background'
        for (iterator = 0; iterator < 3; iterator++) {
            orbB.push(new orb());
        }
        orbGroupB = new orbGroup(orbB);
        orbGroupB.fillType = 'background';
        orbGroupB.sampleSelf = true;
        orbGroupB.filter = 'invert(100%)';
        for (iterator = 0; iterator < 3; iterator++) {
            orbC.push(new orb());
        }
        orbGroupC = new orbGroup(orbC);
        orbGroupC.fillType = 'background';
        orbGroupC.sampleSelf = false;
        orbGroupC.filter = '';
    }

    function draw() {
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        orbGroupA.update();
        orbGroupA.draw();
        orbGroupB.update();
        orbGroupB.draw();
        orbGroupC.update();
        orbGroupC.draw();
        frame = window.requestAnimationFrame(draw);
    }
    
    function orbGroup(orb) {
        this.orb = orb;
        this.swapCanvas = document.createElement('canvas');
        this.swapContext = this.swapCanvas.getContext('2d');
        this.swapCanvas.width = canvas.width;
        this.swapCanvas.height = canvas.height;
        this.fillType = 'color';
        this.shiftBackground = false;
        this.sampleSelf = false;
        this.filter = null;
        this.iterator = null;
        for(this.iterator = 0; this.iterator < orb.length; this.iterator++) {
            orb[this.iterator].swapCanvas = this.swapCanvas;
        }
    }
    
    orbGroup.prototype = {
        copyToSwap: function() {
            this.swapContext.drawImage(canvas, 0,0);
            this.swapContext.filter = this.filter;
        },
        draw: function() {
            if(!this.sampleSelf) {
                this.copyToSwap();
            }
            for(this.iterator = 0; this.iterator < this.orb.length; this.iterator++) {
                this.orb[this.iterator].draw();
            }
            if(this.sampleSelf) {
                this.copyToSwap();
            }
        },
        update: function() {
            for(this.iterator = 0; this.iterator < this.orb.length; this.iterator++) {
                this.orb[this.iterator].update();
            }
        }
    }

    function orb() {
        this.swapCanvas = null;
        this.x = canvas.width/2.0;               // x initial location            
        this.y = canvas.height/2.0;              // y initial location
        this.dx = (Math.random() - 0.5) * 20.0;  // x initial speed
        this.dy = (Math.random() - 0.5) * 20.0;  // y initial speed
        this.dxDecay = 0.996;                    // x speed decay
        this.dyDecay = 0.996;                    // y speed decay
        this.dxRandom = 2.0;                     // x speed randomisation
        this.dyRandom = 2.0;                     // y speed randomisation
        this.mouseExpIn = 0.16;                   // mouse exponential ease-in
        this.shiftBackground = true;             // should the background image be shifted by the speed?
        this.radius = Math.min(canvas.width/4, canvas.height/4);
        this.color = 'black';                    // color fill if fill type is set to 'color'
        this.image = null;                       // image fill if fill type is set to 'image'
        this.fillType = 'background';            // fill type
        this.useDuplicates = true;               // should we allow the ball to wrap around the screen (more expensive) or should we wait for it to go off screen before wraping?
        this.duplicateTop = false;
        this.duplicateBottom = false;
        this.duplicateLeft = false;
        this.duplicateRight = false;
    }
    
    orb.prototype = {
        draw: function() {
            if(this.useDuplicates) {
                if(this.x + this.radius > canvas.width) {
                    this.duplicateLeft = true;
                    this.duplicateRight = false;
                } else if(this.x - this.radius < 0) {
                    this.duplicateLeft = false;
                    this.duplicateRight = true;
                } else {
                    this.duplicateLeft = false;
                    this.duplicateRight = false;
                }
                if(this.y + this.radius > canvas.height) {
                    this.duplicateTop = false;
                    this.duplicateBottom = true;
                } else if (this.y - this.radius < 0) {
                    this.duplicateTop = true;
                    this.duplicateBottom = false;
                } else {
                    this.duplicateTop = false;
                    this.duplicateBottom = false;
                }
                if(this.duplicateLeft) {
                    this.singleDraw(this.x - canvas.width, this.y, this.radius);
                    if(this.duplicateTop) {
                        this.singleDraw(this.x, this.y + canvas.height, this.radius);
                        this.singleDraw(this.x - canvas.width, this.y + canvas.height, this.radius);
                    } else if(this.duplicateBottom) {
                        this.singleDraw(this.x, this.y - canvas.height, this.radius);
                        this.singleDraw(this.x - canvas.width, this.y - canvas.height, this.radius);
                    }
                } else if(this.duplicateRight) {
                    this.singleDraw(this.x + canvas.width, this.y, this.radius);
                    if(this.duplicateTop) {
                        this.singleDraw(this.x, this.y + canvas.height, this.radius);
                        this.singleDraw(this.x + canvas.width, this.y + canvas.height, this.radius);
                    } else if(this.duplicateBottom) {
                        this.singleDraw(this.x, this.y - canvas.height, this.radius);
                        this.singleDraw(this.x + canvas.width, this.y - canvas.height, this.radius);
                    }
                } else if(this.duplicateTop) {
                    this.singleDraw(this.x, this.y + canvas.height, this.radius);
                } else if(this.duplicateBottom) {
                    this.singleDraw(this.x, this.y - canvas.height, this.radius);
                }
            }
            this.singleDraw(this.x, this.y, this.radius);
        },
        singleDraw: function(x,y) {
            if(this.fillType === 'background') {
                context.save();
                context.beginPath();
                context.arc(x, y, this.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.clip();
                context.drawImage(this.swapCanvas, this.shiftBackground ? -this.dx : 0, this.shiftBackground ? -this.dy : 0);
                context.restore();
            } else if(this.fillType === 'image') {
                context.save();
                context.beginPath();
                context.arc(x, y, this.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.clip();
                context.drawImage(img, this.shiftBackground ? -this.dx : 0, this.shiftBackground ? -this.dy : 0);
                context.restore();
            } else if(this.fillType === 'color') {
                context.beginPath();
                context.arc(x, y, this.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fillStyle = this.color;
                context.fill();
            }
        },
        update: function() {
            if(this.useDuplicates) {
                this.x = (this.x + this.dx + canvas.width)%canvas.width;
                this.y = (this.y + this.dy + canvas.height)%canvas.height;
            } else {
                this.x = (this.x + this.dx + this.radius * 3 + canvas.width)%(canvas.width + 2 * this.radius) - this.radius;
                this.y = (this.y + this.dy + this.radius * 3 + canvas.height)%(canvas.height + 2 * this.radius) - this.radius;
            }
            this.dx = this.dx * this.dxDecay + this.dxRandom * (Math.random() - 0.5);
            this.dy = this.dy * this.dyDecay + this.dyRandom * (Math.random() - 0.5);
            if (mouse.onCanvas & mouse.x !== null & mouse.y !== null) {
                this.dx =+ -this.mouseExpIn * (this.x - mouse.x);
                this.dy =+ -this.mouseExpIn * (this.y - mouse.y);
            }
        }
    }
    
    var img = new Image();
    img.addEventListener('load', function() {
        init();
        draw();
    }, false);
    img.src = 'waves4.png';
    
    var follow = false;
    
    var mouse = {};
    mouse.x = null;
    mouse.y = null;
    mouse.dy = null;
    mouse.dx = null;
    mouse.onCanvas = false;
    
    canvas.onmousemove = function(e) {
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
     }

    canvas.addEventListener('mouseover', function() {
        mouse.onCanvas = true;
    });

    canvas.addEventListener('mouseout', function() {
        mouse.onCanvas = false;
    });
}