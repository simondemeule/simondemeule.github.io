 // Coded by Simon Demeule

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;
var follow = false;
var mouseX, mouseY;

function init() {
    canvas.width = document.body.clientWidth; 
    canvas.height = document.body.clientHeight;
    canvasW = canvas.width;
    canvasH = canvas.height;
}

var aa = 0.19;     // accel amplitude

var usea = false;

if (window.DeviceMotionEvent != undefined) {
    usea = true;
	window.ondevicemotion = function(e) {
		ax = event.accelerationIncludingGravity.x * aa;
		ay = event.accelerationIncludingGravity.y * -aa;
    }
}

var ax = 0, ay = 0;

var bidra = 20.0;  // ball initial 1st derivative randomization amplitude
var bcddra = 3.5;  // ball continuous 2nd derivative randomization amplitude
var bcdexp = 0.97; // ball continuous 1st derivative exponential decay
var baexp;         // accel ball-attractor exponential ease-in
if(usea) {
    baexp = 0.006; // ...accel
}
else {
    baexp = 0.002; // ...non accel
}


var aidra = 40.0;  // atractor initial 1st derivative randomization amplitude
var acddra = 2.0;  // atractor continuous 2nd derivative randomization amplitude
var acdexp = 0.97; // atractor continuous 1st derivative exponential decay
var abr = 0.8;     // non-accel attractor boundary repulsion 
var amexp =  0.3;  // non-accel attractor mouse exponential ease-in
var acexp = 0.9;   // accel attractor collision exponential decay

var nballs;        // number of balls

if(usea) {
    nballs = 100;  // ...accel
}
else {
    nballs = 600;  // ...non accel
}

if (window.location.hash) {
    var hash = parseInt(window.location.hash.substring(1));
    if (!isNaN(hash) && isFinite(hash)) {
        nballs = hash;
    } else {
        alert("Invalid hash! Reverting to default (" + nballs + ")")
    }
}

function createNewAttractor() {
    var obj = {};
    obj.x = canvas.width/2.0;
    obj.y = canvas.height/2.0;
    obj.ddx = 0;
    obj.ddy = 0;
    obj.radius = 50;
    obj.color = 'black';
    obj.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    if(usea) {
        obj.dx = 0;
        obj.dy = 0;
        obj.update = function() {
            // check if the attractor will be outside the canvas on the next step.
            // if so, reverse the velocity for the axis, make it decay, and skip
            // the addition of acceleration for this step if it is to drag the attractor
            // further out of the screen. fancyness needed as it allows the attractor to
            // rest.
            if (this.x + this.dx < 0) {
                this.dx = -this.dx * 0.9 + (ax > 0 ? ax : 0);
            }
            else if (this.x + this.dx > canvas.width) {
                this.dx = -this.dx * 0.9 + (ax < 0 ? ax : 0);
            }
            else {
                this.dx += ax;
            }
            if (this.y + this.dy < 0) {
                this.dy = -this.dy * 0.9 + (ay > 0 ? ay : 0);
            }
            else if (this.y + this.dy > canvas.height) {
                this.dy = -this.dy * 0.9 + (ay < 0 ? ay : 0);
            }
            else {
                this.dy += ay;
            }
            // continuous 1st derivative exponential decay prevents large speed vectors and accentuates direction changes 
            this.dx *= acdexp;
            this.dy *= acdexp;
            this.x += this.dx;
            this.y += this.dy;
        }
    }
    else {
        obj.dx = aidra * (Math.random() - 1/2);
        obj.dy = aidra * (Math.random() - 1/2);
        obj.update = function() {
            this.ddx = acddra * (Math.random() - 1/2);
            this.ddy = acddra * (Math.random() - 1/2);
            this.dx += this.ddx - abr * (this.x/canvas.width - .5);
            this.dy += this.ddy - abr * (this.y/canvas.height - .5);
            if (follow == true) {
                this.dx =+ -amexp * (this.x - mouseX);
                this.dy =+ -amexp * (this.y - mouseY);
            }
            // continuous 1st derivative exponential decay prevents large speed vectors and accentuates direction changes 
            this.dx *= acdexp;
            this.dy *= acdexp;
            this.x += this.dx;
            this.y += this.dy;
        }
    }
    
    return obj;
}

function createNewBall() {
    var obj = {};
    obj.x = canvas.width/2.0;
    obj.y = canvas.height/2.0;
    obj.dx = bidra * (Math.random() - 1/2);
    obj.dy = bidra * (Math.random() - 1/2);
    obj.ddx = 0;
    obj.ddy = 0;
    obj.radius = 5;
    obj.color = 'black';
    obj.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    obj.update = function() {
        this.ddx = bcddra * (Math.random() - 1/2);
        this.ddy = bcddra * (Math.random() - 1/2);
        this.dx += this.ddx + baexp * (attractor.x - this.x);
        this.dy += this.ddy + baexp * (attractor.y - this.y);
        /* for the attractor to avoid walls
        this.dx += this.ddx - 6*(this.x/canvas.width - .5);
        this.dy += this.ddy - 6*(this.y/canvas.height - .5); */
        
        // continuous 1st derivative exponential decay prevents large speed vectors and accentuates direction changes 
        this.dx = this.dx * bcdexp;
        this.dy = this.dy * bcdexp;
        // check if the ball will be outside the canvas on the next step.
        // if so, reverse the velocity for the axis. no need to be super
        // fancy as the small balls are always moving
        if (this.x + this.dx < 0 || this.x + this.dx > canvas.width){
            this.dx = -this.dx;
        }
        if (this.y + this.dy < 0 || this.y + this.dy > canvas.height) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
    return obj;
}

var ball = new Array();
for (var i = 0; i < nballs; i++) {
    ball.push(createNewBall());
}

var attractor = createNewAttractor();

function draw() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    attractor.draw();
    attractor.update();
    for (var i = 0; i < nballs; i++) {
        ball[i].draw();
        ball[i].update();
    }
    raf = window.requestAnimationFrame(draw);
}

 canvas.onmousemove = function(e) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
 }

canvas.addEventListener('mouseover', function() {
    follow = true;
});

canvas.addEventListener('mouseout', function() {
    follow = false;
});

init();
draw();