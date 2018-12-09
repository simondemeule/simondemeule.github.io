// written by Simon Demeule

window.onload = function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    var audioContext;
    var audioContextReady = false;
    var frame;
    var orbA = new Array();
    var orbGroupA;
    var orbB = new Array();
    var orbGroupB;
    var orbC = new Array();
    var orbGroupC;
    var initScreen;
    var numVoices = 6;

    function init() {
        if(!!window.chrome && !!window.chrome.webstore) {
            for (i = 0; i < numVoices; i++) {
                orbA.push(new Orb());
            }
            orbGroupA = new OrbGroup(orbA);
            orbGroupA.fillType = 'background';
            orbGroupA.sampleSelf = true;
            orbGroupA.filter = 'blur(6px)';
            orbGroupA.fillType = 'background'
            for (i = 0; i < 3; i++) {
                orbB.push(new Orb());
            }
            orbGroupB = new OrbGroup(orbB);
            orbGroupB.fillType = 'background';
            orbGroupB.sampleSelf = false;
            orbGroupB.filter = '';
            initScreen = new InitScreen();
            draw();
        } else {
            context.fillStyle = "#000000";
            context.textAlign = "center";
            context.font = "" + (canvas.width * 0.05) + "px Futura,Trebuchet MS,Arial,sans-serif";
            context.fillText("Sorry, your browser is not supported.", canvas.width/2, canvas.height/2 - canvas.width * 0.05);
            context.fillText("Please use Google Chrome.", canvas.width/2, canvas.height/2 + canvas.width * 0.05)
        }
    }

    function draw() {
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        orbGroupA.update();
        orbGroupA.draw();
        orbGroupB.update();
        orbGroupB.draw();
        if(audioContextReady) {
            for(let i = 0; i < numVoices; i++) {
                voice[i].panner.pan.linearRampToValueAtTime(2.0 * (orbA[i].x - canvas.width / 2) / canvas.width, audioContext.currentTime + 0.03);
                voice[i].modulator.gain.gain.linearRampToValueAtTime(100 * Math.pow(2, 3 * orbA[i].y / canvas.height), audioContext.currentTime + 0.03);
            }
        }
        initScreen.update();
        initScreen.draw();
        frame = window.requestAnimationFrame(draw);
    }

    function OrbGroup(orb) {
        this.orb = orb;
        this.swapCanvas = document.createElement('canvas');
        this.swapContext = this.swapCanvas.getContext('2d');
        this.swapCanvas.width = canvas.width;
        this.swapCanvas.height = canvas.height;
        this.fillType = 'color';
        this.shiftBackground = false;
        this.sampleSelf = false;
        this.filter = null;
        for(let i = 0; i < orb.length; i++) {
            orb[i].swapCanvas = this.swapCanvas;
        }
    }

    OrbGroup.prototype = {
        copyToSwap: function() {
            this.swapContext.drawImage(canvas, 0,0);
            this.swapContext.filter = this.filter;
        },
        draw: function() {
            if(!this.sampleSelf) {
                this.copyToSwap();
            }
            for(let i = 0; i < this.orb.length; i++) {
                this.orb[i].draw();
            }
            if(this.sampleSelf) {
                this.copyToSwap();
            }
        },
        update: function() {
            for(let i = 0; i < this.orb.length; i++) {
                this.orb[i].update();
            }
        }
    }

    function Orb() {
        this.swapCanvas = null;
        this.x = canvas.width/2.0;               // x initial location
        this.y = canvas.height/2.0;              // y initial location
        this.dx = (Math.random() - 0.5) * 20.0;  // x initial speed
        this.dy = (Math.random() - 0.5) * 20.0;  // y initial speed
        this.dxDecay = 0.996;                    // x speed decay
        this.dyDecay = 0.996;                    // y speed decay
        this.dxRandom = 2.0;                     // x speed randomisation
        this.dyRandom = 2.0;                     // y speed randomisation
        this.mouseExpIn = 0.16;                  // mouse exponential ease-in
        this.shiftBackground = true;             // should the background image be shifted by the speed?
        this.radius = Math.min(canvas.width/6, canvas.height/6);
        this.color = 'black';                    // color fill if fill type is set to 'color'
        this.image = null;                       // image fill if fill type is set to 'image'
        this.fillType = 'background';            // fill type
        this.useDuplicates = true;               // should we allow the ball to wrap around the screen (more expensive) or should we wait for it to go off screen before wraping?
        this.duplicateTop = false;
        this.duplicateBottom = false;
        this.duplicateLeft = false;
        this.duplicateRight = false;
    }

    Orb.prototype = {
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
                context.drawImage(image, this.shiftBackground ? -this.dx : 0, this.shiftBackground ? -this.dy : 0);
                context.restore();
            } else if(this.fillType === 'color') {
                context.beginPath();
                context.arc(x, y, this.radius, 0, Math.PI * 2, true);
                context.closePath();
                context.fillStyle = this.color;
                context.fill();
            }
        },
        onWrap: function() {},
        update: function() {
            if(this.useDuplicates) {
                if(this.hasOwnProperty("onWrap") & ( (this.x + this.dx > canvas. width) | (this.x + this.dx < 0) | (this.y + this.dy > canvas.height) | (this.y + this.dy < 0) )) {
                    this.onWrap();
                }
                this.x = (this.x + this.dx + canvas.width)%canvas.width;
                this.y = (this.y + this.dy + canvas.height)%canvas.height;
            } else {
                if(this.hasOwnProperty("onWrap") & ( (this.x + this.dx > canvas. width + this.radius) | (this.x + this.dx < 0 - this.radius) | (this.y + this.dy > canvas.height + this.radius) | (this.y + this.dy < 0 - this.radius) )) {
                    this.onWrap();
                }
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

    function InitScreen() {
        this.swapCanvas = document.createElement('canvas');
        this.swapContext = this.swapCanvas.getContext('2d');
        this.swapCanvas.width = canvas.width;
        this.swapCanvas.height = canvas.height;
        this.fadeout = false;
        this.visible = true;
        this.opacity = 1.0;
        this.blurRadius = 20.0;
        this.copyToSwap = function() {
            this.swapContext.drawImage(canvas, 0,0);
            this.swapContext.filter = "blur(" + this.blurRadius + "px)";
        }
        this.draw = function() {
            if(this.visible) {
                this.copyToSwap()
                context.drawImage(this.swapCanvas, 0, 0);
                context.fillStyle = "rgba(0, 0, 0, " + this.opacity + ")";
                context.textAlign = "center";
                context.font = "" + (canvas.width * 0.05) + "px Futura,Trebuchet MS,Arial,sans-serif";
                context.fillText("Click to begin", canvas.width/2, canvas.height/2 - canvas.width * 0.05);
                context.fillText("Click again to generate new harmony", canvas.width/2, canvas.height/2 + canvas.width * 0.05)
            }
        }
        this.update = function() {
            if(this.fadeout & this.visible) {
                this.opacity *= 0.9;
                this.blurRadius *= 0.9;
                if(this.opacity <= 0.01) {
                    this.visible = false;
                }
            }
        }
    }

    var image = new Image();
    image.addEventListener('load', function() {
        imageLoaded = true;
        init();
    }, false);
    image.src = 'IMG_9500.jpg';

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

    document.addEventListener("click", createAudioContext);

    // Google decided to introduce a feature preventing an audiocontext from being created before user interaction to stop annoying autoplay audio. It turns out it's completely pointless and just annoying for game developers, as «onmousemove» and «onscroll» are user events, and allows those websites to still be annoying. Here I've decided to just put a click to begin screen to avoid unexpected behaviour if the user doesn't move his mouse.

    // bunch of interesting examples: https://www.music.mcgill.ca/~ich/classes/mumt307_14/WebAudioAPI.html
    // audiocontext reference https://developer.mozilla.org/fr/docs/Web/API/AudioContext

    function Harmonic() {
        // harmonically-related ratio generator
        this.harmonicSource =  [1, 1, 2, 2, 2, 3, 3];
        this.harmonicIterations = 2;
        this.single = function(harmonicSource = this.harmonicSource, harmonicIterations = this.harmonicIterations, higherBound = -1, lowerBound = -1) {
            let single = 1.0;
            if(lowerBound < 0 | higherBound < 0) {
                // run calculation without considering bounds
                for(let i = 0; i < harmonicIterations; i++) {
                    if(Math.random() < 0.5) {
                        single *= harmonicSource[Math.floor(Math.random() * harmonicSource.length)];
                    } else {
                        single /= harmonicSource[Math.floor(Math.random() * harmonicSource.length)];
                    }
                }
            } else {
                // run calculation with bounds
                let harmonicSourceInBounds = new Array();
                for(let i = 0; i < harmonicIterations; i++) {
                    harmonicSourceInBounds = [];
                    if(Math.random() < 0.5) {
                        for(let j = 0; j < harmonicSource.lenght; j++) {
                            if( (single * hamonicSource[j] <= higherBound) & (single * hamonicSource[j] >= lowerBound) ) {
                                harmonicSourceInBounds.push(harmonicSource[j]);
                            }
                        }
                        if(harmonicSourceInBounds.lenght >= 1) {
                            single *= harmonicSource[Math.floor(Math.random() * harmonicSourceInBounds.length)];
                        }
                    } else {
                        for(let j = 0; j < harmonicSource.lenght; j++) {
                            if( (single / hamonicSource[j] <= higherBound) & (single / hamonicSource[j] >= lowerBound) ) {
                                harmonicSourceInBounds.push(harmonicSource[j]);
                            }
                        }
                        if(harmonicSourceInBounds.lenght >= 1) {
                            single /= harmonicSource[Math.floor(Math.random() * harmonicSourceInBounds.length)];
                        }
                    }
                }
            }
            return single;
        }
    }

    var harmonic = new Harmonic();
    var tonic = 523.25; // Do
    var voice = new Array();

    function createAudioContext() {
        initScreen.fadeout = true;
        audioContext = new AudioContext();

        // carrier/modulator objects from http://greweb.me/2013/08/FM-audio-api/

        function Modulator(type, frequency, index) {
            this.oscillator = audioContext.createOscillator();
            this.gain = audioContext.createGain();
            this.oscillator.type = type;
            this.oscillator.frequency.value = frequency;
            this.gain.gain.value = index;

            this.oscillator.connect(this.gain);
            this.oscillator.start(0);
        }

        function Carrier(type, frequency) {
            this.oscillator = audioContext.createOscillator();
            this.gain = audioContext.createGain();
            this.oscillator.type = type;
            this.oscillator.frequency.value = frequency;

            this.oscillator.connect(this.gain);
            this.oscillator.start(0);
        }

        function Voice(carrierFrequency, modulatorFrequency, index) {
            this.carrierFrequency = carrierFrequency;
            this.modulatorFrequency = modulatorFrequency;
            this.modulator = new Modulator("sine", modulatorFrequency, index);
            this.carrier = new Carrier("sine", carrierFrequency);
            this.panner = audioContext.createStereoPanner();

            this.modulator.gain.connect(this.carrier.oscillator.frequency);
            this.carrier.gain.connect(this.panner);
            this.draw = function() {
                for(let i = 0; i < 3; i++) {
                    let cy = frequencyToHeight(this.carrierFrequency);
                    if(i == 0) {
                        context.moveTo(0, cy);
                        context.lineTo(canvas.width, cy);
                    } else {
                        let muy = frequencyToHeight(carrierFrequency + modulatorFrequency * i);
                        let mly = frequencyToHeight(carrierFrequency - modulatorFrequency * i);
                        context.moveTo(0, muy);
                        context.lineTo(canvas.width, muy);
                        context.moveTo(0, mly);
                        context.lineTo(canvas.width, mly);
                    }
                }
                context.stroke();
            }
        }

        function frequencyToHeight(frequency) {
            return Math.log2(frequency)/Math.log2(20000)*canvas.height;
        }

        function heightToFrequency(height) {
            return Math.pow(2, height/canvas.height*20000);
        }

        //      Voices
        //  --------------
        //  |  Modulator |--
        //  |      |     | |--
        //  |      V     | | |
        //  |   Carrier  | | |
        //  |      |     | | |
        //  |      V     | | | with randomized frequency, modulation index and panning
        //  |   Panner   | | |
        //  -------------- | |
        //    -------------- |
        //      --------------
        //           |
        //           V
        //     ---- Sum
        //     |     |
        //     |     V
        //     |   Delay <-- Modulator (sub audio rate)
        //     |     |
        //     |     V
        //     ---> Sum
        //           |
        //           V
        //          Out

        var delay = audioContext.createDelay(0.1);
        var gain = audioContext.createGain();

        for(let i = 0; i < numVoices; i++) {
            let temp = harmonic.single();
            voice.push(new Voice(tonic * temp, tonic * temp * harmonic.single(), 0));
            voice[i].carrier.gain.gain.value = Math.sqrt(1.0/numVoices);
            voice[i].panner.connect(delay);
            voice[i].panner.connect(gain);

            orbA[i].onWrap = function() {
                let random = Math.random();
                if(random > 0.97) {
                    voice[i].modulator.oscillator.frequency.exponentialRampToValueAtTime(tonic * harmonic.single(), audioContext.currentTime + 0.2);
                }
                if(random < 0.03) {
                    voice[i].carrier.oscillator.frequency.exponentialRampToValueAtTime(tonic * harmonic.single(), audioContext.currentTime + 0.2);
                }
            }
        }

        delayModulator = new Modulator("sine", 0.05, 0.007);
        delayModulator.gain.connect(delay.delayTime);

        delay.delayTime.value = 0.05;
        delay.connect(gain);

        gain.connect(audioContext.destination);
        gain.gain.value = 0.0000001;
        gain.gain.exponentialRampToValueAtTime(1.0, audioContext.currentTime + 0.4);

        document.removeEventListener("click", createAudioContext);
        document.addEventListener("click", generateNewHarmony);
        audioContextReady = true;
    }

    function generateNewHarmony() {
        for(let i = 0; i < numVoices; i++) {
            voice[i].modulator.oscillator.frequency.exponentialRampToValueAtTime(tonic * harmonic.single(), audioContext.currentTime + 0.2);
            voice[i].carrier.oscillator.frequency.exponentialRampToValueAtTime(tonic * harmonic.single(), audioContext.currentTime + 0.2);
        }
    }
}
