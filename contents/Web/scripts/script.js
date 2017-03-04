var state;                          // current website state: free, project
var $project;                       // current project element
var $newproject;                    // new project element
var $target;                        // current target element
var $newtarget;                     // new target element
var hash;                           // current hash, used to detect valid hash changes in edithash()
var scrollhoriz = true;             // momentarily enable/disable horizontal scroll according to state
var supported = false;              // wether the browser can render the layout
var scrolltype;                     // the type of scrolling supported by the browser: conv, free, anim

/* TODO
- rethink a better wide display layout
- rewrite all anim functions with proper queues
- write projtoproj()
- make scrolling animation time proportionnal
- trigger projtofree() and recalculate post hiding margin-bottom on window resize
- about build()
  - add project ids automatically
  - figure out title bars
- optimise loading
*/

$(document).ready(function() {
    loadvariables();
    updatesupport();
    build();
});

var $document;
var $window;
var $body;
var $sub;
var $tray;
var $allprojects;
var $alltargets;
var numprojects;

function loadvariables() {
    $document = $(document);
    $window = $(window);
    $body = $("body");
    $sub = $(".sub-body");
    $tray = $(".tray");
    $allprojects = $(".project");
    $alltargets = $allprojects.children(".target");
    numprojects = $(".project").length;
}

function updatesupport() {
    var isMac = navigator.platform.indexOf('Mac') > -1;
    var isMobile = false; if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)) { 
        isMobile = true
    };
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    if(isMac) {
        scrolltype = "conv";
    }
    else if(isMobile) {
        scrolltype = "free";
    }
    else {
        scrolltype = "anim";
    }

    console.log("/ isMac " + isMac);
    console.log("/ isMobile " + isMobile);
    console.log("/ scrolltype " + scrolltype);
    console.log("/ isSafari " + isSafari);
    console.log("/ isChrome " + isChrome);
    if(isSafari || isChrome) {
        supported = true;
        console.log("/ supported " + supported);
    }
    else {
        suppoted = false;
        console.log("/ supported " + supported);
        $(".obstructor-loading").text("Error");
        $(".obstructor-desc").addClass("view");
        window.stop(); //works in all browsers but IE    
        if ($.browser.msie) {document.execCommand("Stop");}; //works in IE,
    }
}

function build() { 
    // styling
    var $image;
    var imageheight;
    var imageoffset = "4rem";
    var calculated;
    var indexchunk = "";
    // carousel width
    $(".carousel").css("width", (10 + (90 * numprojects)) + "vw");
    $allprojects.each(function(index) {
        console.log("+ " + $(this).attr("id"));
        if($(this).hasClass("index") === false) {
            // concat the project-links together
            // todo: add project ids automatically
            // todo: figure out title bar
            indexchunk += "<div class='project-link' href='#" + $(this).children(".target").attr("id") + "'>" + $(this).children(".pre-wrapper").children(".title").text() + "</div>" ;
            console.log("+ is not index");
            // post hiding via img margin-bottom
            $image = $(this).children(".main").children("img");
            imageheight = parseFloat($image.css("height")) * (100 / document.documentElement.clientWidth) + "vw";
            calculated = "calc(100vh - " + imageheight + " - " + imageoffset + ")";
            $image.css("margin-bottom", calculated); 
            console.log("+ img calculated " + calculated);
        }
        else {
            console.log("+ is index")
        }
    });
    // build index
    // remove duplicate white space
    indexchunk = indexchunk.replace(/\s+/g, ' '); 
    console.log("+ indexchunk " + indexchunk);
    // append once
    $(".project-link-wrapper").append(indexchunk);
}

$(window).on('load', windowloadhandler);

function windowloadhandler() {
    // on document load, check hash for state
    if(location.hash !== "") {
        if($(":target").length === 1) {
            // the hash has a valid target
            state = "load";
            update("project", $(":target"));
        }
        else {
            edithash();
            state = "free";
            initscroll();
        }
    }
    else {
        state = "free";
        initscroll();
    }
    if(supported === true) {
        $(".obstructor").addClass("view");
    }
}

function initscroll() {
    // initiate proper mousewheelhandler for platform
    console.log("/ initscroll");
    console.log("/ scrolltype " + scrolltype);
    if(scrolltype === "free") {
        console.log("/ mousewheel -> nothing");
        return;
    }
    else if(scrolltype === "conv") {
        console.log("/ mousewheel -> mousewheelhandlerconv");
        function mousewheelhandlerconv(event, delta, deltaX, deltaY) {
            if(scrollhoriz === true) {
                event.preventDefault();
                this.scrollLeft += deltaX - deltaY;
            }
        }
         $($sub).mousewheel(mousewheelhandlerconv);
    }
    else if(scrolltype === "anim") {
        console.log("/ mousewheel -> mousewheelhandleranim");
        function mousewheelhandleranim(event, delta, deltaX, deltaY) {
            if(scrollhoriz === true) {
                event.preventDefault();
                scrollprojectrelative(deltaX - deltaY > 0 ? 1 : -1);
            }
        }
        $($sub).mousewheel(mousewheelhandleranim);
    }
}

var scrollproject = 0;          // current project scrolled to, by it's index in $allprojects
var newscrollproject;           // new project, same idea.
var blockscrollproject = false; // disable horizontal scrolling while animation is ongoing

function scrollprojectrelative(deltaproject) {
    // this hijacks horizontal scrolling and breaks it into animated steps.
    // TODO: consolidate into main horiz scroll anim handler
    if(blockscrollproject === true) {
        return;
    }
    newscrollproject = scrollproject + deltaproject;
    if(newscrollproject !== scrollproject && newscrollproject >= 0 && newscrollproject < numprojects) {
        blockscrollproject = true;
        $sub.animate({scrollLeft: $alltargets.eq(newscrollproject).offset().left + $sub.scrollLeft()}, (newscrollproject === 0 || scrollproject === 0 ? 400 : 600)).queue(function() {
            scrollproject = newscrollproject;
            blockscrollproject = false;
            $(this).dequeue();
        });
    }
}

window.onhashchange = windowhashchangehandler;

function windowhashchangehandler() {
    if(document.location.hash !== "#" + hash) {
        console.log("% hash change event / different / " + document.location.hash);
        if(document.location.hash !== "") {
            if($(":target").length === 1) {
                // the hash has a valid target
                update("project", $(":target"));
            }
            else {
                edithash(hash);
            }
        }
        else {
            update("free");
        }
    }
    else {
        console.log("% hash change event / identical / " + document.location.hash);
    }
}

function edithash(newhash) {
    if(typeof newhash === "undefined") {
        // no arg -> reset hash
        if(document.location.hash === "") {
            // the intial event may be a hashchange that cleared the hash, in this case we avoid clearing it twice to preserve history
            console.log("% hash already cleared");
        }
        else {
            if(history.pushState) {
                history.pushState("", document.title, window.location.pathname + window.location.search);
                console.log("% hash cleared through pushstate");
            }
            else {
                // store current scroll offset
                var scrollV, scrollH
                scrollV = document.body.scrollTop;
                scrollH = document.body.scrollLeft;

                console.log("% hash cleared through fallback");
                document.location.hash = "";

                // restore scroll offset
                document.body.scrollTop = scrollV;
                document.body.scrollLeft = scrollH;
            }
        }
        hash = "";
    }
    else {
        // arg -> set hash
        if(document.location.hash === "#" + newhash) {
            // the intial event may be a hashchange that set the hash, in this case we avoid setting it twice to preserve history
            console.log("% hash already set to #" + newhash);
        }
        else {
            document.location.hash = newhash;
            console.log("% hash set to #" + newhash);
        }
        hash = newhash;
        
    }
}

$(document).on("click", ".trigger", triggerclickhandler);

function triggerclickhandler(event) {
    if(state === "free") {
        update("project", $(event.target).closest(".project"));
    }
}

$(document).on("click", ".exit-box", exitboxclickhandler);

function exitboxclickhandler() {
    console.log("% exit click event");
    update("free");
}

$(document).on("click", ".index-box", indexboxclickhandler);

function indexboxclickhandler() {
    console.log("% index click event");
    update("project", $("#index"));
}

$(document).on("click", ".project-link", projectlinkclickhandler);

function projectlinkclickhandler(event) {
    update("project", $($(event.target).attr("href")));
}

function update(newstate, $obj) {
    // state updater and animation launcher
    console.log("------------ new update ------------");
    console.log("newstate ------- " + newstate);
    if(newstate === "project") {
        if($obj.hasClass("project")) {
            if(newstate === state && $obj.is($project)) {
                console.log("states are identical @ project & $project");
                return; // states are identical
            }
            $newproject = $obj;
            $newtarget = $obj.children(".target");
            console.log("$newproject id - " + $newproject.attr("id"));
            console.log("$newtarget id -- " + $newtarget.attr("id"));
            console.log("^ defined using $obj with class .project");
        }
        else if($obj.hasClass("target")) {
            if(newstate === state && $obj.is($target)) {
                console.log("states are identical @ project & $target");
                return; // states are identical
            }
            $newtarget = $obj;
            $newproject = $obj.parent();
            console.log("$newproject id - " + $newproject.attr("id"));
            console.log("$newtarget id -- " + $newtarget.attr("id"));
            console.log("^ defined using $obj with class .target");
        }
        else {
            console.log("invalid $obj");
            return; // invalid $obj
        }
        // $newtarget and $newproject are now both defined
        if(state === "free" || state === "load") {
            // animate free -> project
            freetoproj();
        }
        else if(state === "project") {
            // animate project -> project
            projtoproj();
        }
    }
    else if(newstate === "free") {
        if(newstate === state) {
            console.log("states are identical @ free");
            return; // states are identical
        }
        else {
            // animate project -> free
            projtofree();
        }
    }
    $project = $newproject;
    $target = $newtarget;
    state = newstate;
    console.log("state ---------- " + state);
    console.log("$project id ---- " + $project.attr("id"));
    console.log("$target id ----- " + $target.attr("id"));
    console.log("------------------------------------");
}

function freetoproj() {
    // state animation: free -> project                           
    console.log("~ free -> proj");
    // if target project is index, avoid changing hash and adding classes; just scroll
    var toindex = $newtarget.is($("#index")); 
    // if initial state is "load", initialize scroll after first animated scroll is done
    var fromload = state === "load"; 
    console.log("~ toindex " + toindex);
    console.log("~ fromload " + fromload);
    console.log(state);
    $newproject.addClass("view");
    if(toindex === false) {
        $tray.delay(300).queue(function(next) {
            $(this).addClass("view-exit-box");
            next();
        });
        $newproject.children(".post-wrapper").addClass("unhide");
        scrollhoriz = false;
    }

    $sub.animate({scrollLeft: $newtarget.offset().left + $sub.scrollLeft()}, 600).queue(function() {
        if(toindex === false) {
            edithash($newtarget.attr("id"));
            $sub.addClass("view");
            $newproject.addClass("height-auto");
        }
        else {
            state = "free";
        }
        if(fromload) {
            initscroll();
        }
        $(this).dequeue();
    });
}

function projtoproj() {
    // state animation: project -> project
    // todo!!!!
    console.log("~ proj -> proj");
}

function projtofree() {
    // state animation: project -> free
    console.log("~ proj -> free");
    $project.removeClass("view");
    $tray.removeClass("view-exit-box");

    if($(window).scrollTop() === 0) {
        edithash();
        $sub.removeClass("view");
        $project.removeClass("height-auto");
        scrollhoriz = true;
        $project.delay(400).queue(function(next) {
            $(this).children(".post-wrapper").removeClass("unhide");
            next();
        });
    }
    else {
        $sub.addClass("noscroll");
        $body.animate({scrollTop: 0}, 600).queue(function() {
            edithash();
            $sub.removeClass("noscroll");
            $sub.removeClass("view");
            $project.removeClass("height-auto");
            $project.children(".post-wrapper").removeClass("unhide");
            scrollhoriz = true;
            $(this).dequeue();
        });
    }
}