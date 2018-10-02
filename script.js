// created by simon demeule

/* TODO

• rewrite this whole mess with a priority queue
• revert to low-res project content images on replacetothumb aka fix safari lag
• make thumb naming systematic
• substitute hover effects by scroll detection on mobile
• debounced resize obstructor & recalculation methods
• get futura + futura book for real and implement font loading detection
• build skeleton from single project tags
• get proper sub/sup naming convention
• remove redundant CSS in project pages (obstructor stuff)
• dynamic title length

self note: to enable/disable google analytics, comment/uncomment script in index.html and uncomment gtag(...) in this script

*/

/* This is a constructor for an object that exists for every project and holds info and methods about styling, file locations, content, viewing and loading status, etc. It is stored in the projects[] array */
function loadProjectObject(name) {
    var obj = {};
    obj.name = name;
    obj.stateViewActive = false;             // true when project is expanded
    obj.stateViewLoad = false;               // true when the content and main image is loaded
    obj.stateObjectLoad = false;             // true when the object's load function query has returned and the object is fully initialized
    obj.stateImageLoad = false;              // true when the object's main image is loaded
    obj.stateContentLoad = false;            // true when the object's content is loaded
    obj.stateContentImagesThumbLoad = false; // true when the object's content thumb images' are done loading
    obj.stateContentImagesFullLoading = false;  // true when the object's content full images have started loading
    obj.numContentImagesThumbLoad = 0;
    obj.numContentImages = 0;
    obj.file = "/" + name + "/index.html";
    obj.$ = $(".project#" + obj.name);
    obj.$sub = obj.$.children(".project-sub");
    obj.$imagesub = obj.$sub.children(".project-image-sub");
    obj.$contentsub1 = obj.$sub.children(".project-content-sub-1");
    obj.$contentsub2 = obj.$contentsub1.children(".project-content-sub-2");
    $.get(obj.file, function (data) {
        /* this fetches some data from the project's index file */
        obj.fileImage = "/" + obj.name + "/" + $(data).filter(".project-image").data("src");
        obj.title = $(data).filter(".project-title");
        obj.titleStyle = $(data).filter(".title-style").attr("style");
        obj.backgroundStyle = $(data).filter(".background-style").attr("style");

        obj.stateObjectLoad = true;
        console.log("* loaded project object " + obj.name);
        checkProjectObjectLoad();
    });
    obj.loadContent = function(callback) {
        /* this loads and returns the project's content from it's index file */
        console.log("> requested content for " + obj.name);
        $.get(obj.file, function (data) {
            console.log("* recieved content for " + obj.name);
            var content = $(data).filter(".project-content");
            callback(content);
        });
    }
    obj.loadImage = function(callback) {
        /* this loads and returns the project's main image from it's index file */
        console.log("> requested image for " + obj.name);
        var image = $("<img />").attr("src", obj.fileImage).on("load", function() {
            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                alert('broken image!');
            } else {
                console.log("* recieved image for " + obj.name);
                callback(image);
            }
        });
    }
    return obj;
}

/* The loadProjectObjects() function filters through the page skeleton to find projects. It then creates a project object in the projects[] array for each of them */

var projects = new Array();
var projectObjectsLoaded = false;
var projectViewsLoaded = false;

function loadProjectObjects() {
    console.log("> loading projects array");
    $(".project").each(function (i) {
        projects.push(loadProjectObject($(this).attr("id")));
    });
}

/* Everytime a project object finishes loading, it calls the checkProjectObjectLoad() function, which checks if all other project objects are loaded. If they are, it calls onAllProjectObjectsLoaded(), which then sets the initial active project and calls loadProjectViews(), which appends in the projects. */

function checkProjectObjectLoad() {
    console.log("> checking project object loading");
    var totalProjectObjects = $(".project").length;
    
    if(projects.length != totalProjectObjects) {
        console.log("| array incomplete");
        return;
    }
    for(var i = 0; i < totalProjectObjects; i++) {
        if(!projects[i].stateObjectLoad) {
            console.log("| first unloaded project: " + projects[i].name);
            console.log("| not all loaded");
            return;
        }
    }
    console.log("| all loaded")
    projectObjectsLoaded = true;
    onAllProjectObjectsLoaded();
}

function onAllProjectObjectsLoaded() {
    active = getProjectFromURL()
    setActiveProject(active);
    loadProjectViews();
    updateOverProjectTimeout = setTimeout(updateOverProject, 200);
}

function loadProjectViews() {
    console.log("loading project views");
    var active = getActiveProject();
    for (var i = 0; i <  projects.length; i++) {
        if (active === i) {
            appendProjectFull(i);
            replaceTitle(i);
        } else {
            appendProjectThumb(i);
        }
    }
}

/* A similar process is reiterated here: the append functions calls the  checkProjectViewLoad() function to check if all other projects are rendered. When they all are, all that is left is to set the intial scroll, enable transitions, and remove the obstructor*/

function checkProjectViewLoad() {
    console.log("> checking project view loading");
    var totalProjectViews = projects.length;
    var loadedProjectViews = 0;
    for(var i = 0; i < totalProjectViews; i++) {
        if(projects[i].stateViewLoad) {
            loadedProjectViews++;
        } else {
            console.log("| unloaded project: " + projects[i].name);
        }
    }
    if(totalProjectViews == loadedProjectViews) {
        console.log("| all loaded")
        projectViewsLoaded = true;
        onAllProjectViewsLoaded();
    } else {
        console.log("| not all loaded");
    }
}

function updateLoadingBar() {
    console.log("> updating loading bar")
    var totalProjectElements = projects.length * 2;
    var loadedProjectElements = 0;
    for(var i = 0; i < projects.length; i++) {
        if(projects[i].stateContentLoad) {
            loadedProjectElements++;
        }
        if(projects[i].stateImageLoad) {
            loadedProjectElements++;
        }
    }
    $(".obstructor-loading-bar").css("width", (100.0 * loadedProjectElements / totalProjectElements) +"vw" );
}

function onAllProjectViewsLoaded() {
    setInitialScroll();
    console.log("==== page loaded ====")
    
}

/* The next few append functions take care of dynamic styling */

function appendProjectBackgroundStyle(i) {
    console.log("> appending background style " + projects[i].name);
    projects[i].$sub.attr("style", projects[i].backgroundStyle);
}

function appendProjectContentStyle(i) {
    console.log("> appending content style " + projects[i].name);
    var $style = $("#content-style");
    var contentHeight = projects[i].$contentsub2.children(".project-content").height()/rem;
    var htmlString = 
    "#" + projects[i].name + ">.project-sub.full>.project-content-sub-1>.project-content-sub-2 {\n"+
        "max-height:" + (contentHeight + 2) + "rem; \n" +
    "}\n" +
    "#" + projects[i].name + ">.project-sub.full {\n" +
        "padding-bottom:" + (contentHeight + 4) + "rem;\n" +
    "}\n";
    if($style.length === 0) {
        $("<style>").prop("type", "text/css").html(htmlString).prop("id", "content-style").appendTo("head");
    } else {
        $style.append(htmlString);
    }
}

/* broken for now
function recalculateContentStyles() {
    console.log("> recalculating content styles");
    updateRem();
    $("#content-style").remove();
    for(var i = 0; i < projects.length; i++) {
        appendProjectContentStyle(i);
    }
}
*/

function appendProjectTitle(i) {
    console.log("> appending title " + projects[i].name);
    projects[i].$sub.prepend(projects[i].title);
    // this is necessary for some reason
    projects[i].$sub.children(".project-title").attr("style", projects[i].titleStyle);
}

/* The appendProject... functions can only be called at the document's initial load, and puts the project's contents into the page skeleton. In the case of  appendProjectFull(), it will also load the project's content images. For either appendPrject... functions, when all content/images are loaded, the project's view will be marked as loaded, and checkProjectViewLoad() will check if all others are also loaded */

function appendProjectThumb(i) {
    // needed because $.get is async: by the time the request had succeeded, the index would change.
    console.log("> appending thumb " + projects[i].name);
    appendProjectTitle(i);
    appendProjectBackgroundStyle(i);
    projects[i].loadImage(function (image) {
        projects[i].stateImageLoad = true;
        projects[i].$imagesub.append(image);
        updateLoadingBar();
        if(projects[i].stateContentLoad === true) {
            console.log("| loaded project view for " + projects[i].name);
            projects[i].stateViewLoad = true;
            appendProjectContentStyle(i);
            checkProjectViewLoad();
        }
    });
    projects[i].loadContent(function(content) {
        console.log("| requested project content images for " + projects[i].name)
        projects[i].$contentsub2.append(content);
        var $images = projects[i].$contentsub2.children(".project-content").children("img");
        projects[i].numContentImages = $images.length;
        console.log("| counted " + projects[i].numContentImages + " project content images for " + projects[i].name);
        if(projects[i].numContentImages === 0) {
            console.log("| loaded content for " + projects[i].name + " (trivial case)");
            projects[i].stateContentLoad = true;
            updateLoadingBar();
            if(projects[i].stateImageLoad === true) {
                console.log("| loaded project view for " + projects[i].name);
                projects[i].stateViewLoad = true;
                appendProjectContentStyle(i);
                checkProjectViewLoad();
            }
        } else {
            $images.each(function(index, element) {
                $(element).on("load", function() {
                    console.log("* loaded content thumb image for " + projects[i].name);
                    $(element).off("load");
                    projects[i].numContentImagesThumbLoad++;
                    if(projects[i].numContentImagesThumbLoad === projects[i].numContentImages) {
                        console.log("| loaded content for " + projects[i].name);
                        projects[i].stateContentLoad = true;
                        updateLoadingBar();
                        if(projects[i].stateImageLoad === true) {
                            console.log("| loaded project view for " + projects[i].name);
                            projects[i].stateViewLoad = true;
                            appendProjectContentStyle(i);
                            checkProjectViewLoad();
                        }
                    }
                }.bind(i));
            }.bind(i))
        }
    }.bind(i))
}

function appendProjectFull(i) {
    console.log("> appending full " + projects[i].name);
    appendProjectTitle(i);
    appendProjectBackgroundStyle(i);
    projects[i].$.addClass("full");
    projects[i].$sub.addClass("full");
    projects[i].loadImage(function (image) {
        console.log("* loaded project image " + projects[i].name);
        projects[i].stateImageLoad = true;
        projects[i].$imagesub.append(image);
        updateLoadingBar();
        if(projects[i].stateContentLoad === true) {
            console.log("| loaded project view " + projects[i].name);
            projects[i].stateViewLoad = true;
            appendProjectContentStyle(i);
            checkProjectViewLoad();
        }
    })
    projects[i].loadContent(function(content) {
        console.log("| requested content thumb images for " + projects[i].name)
        projects[i].$contentsub2.append(content);
        var $images = projects[i].$contentsub2.children(".project-content").children("img");
        projects[i].numContentImages = $images.length;
        console.log("| counted " + projects[i].numContentImages + " content images for " + projects[i].name);
        if(projects[i].numContentImages === 0) {
            console.log("| loaded content for " + projects[i].name + " (trivial case)");
            projects[i].stateContentLoad = true;
            updateLoadingBar();
            if(projects[i].stateImageLoad === true) {
                console.log("| loaded project view for " + projects[i].name);
                projects[i].stateViewLoad = true;
                appendProjectContentStyle(i);
                checkProjectViewLoad();
            }
        } else {
            $images.each(function(index, element) {
                $(element).on("load", function() {
                    console.log("* loaded content thumb image for " + projects[i].name);
                    $(element).off("load");
                    projects[i].numContentImagesThumbLoad++;
                    if(projects[i].numContentImagesThumbLoad === projects[i].numContentImages) {
                        console.log("| loaded content for " + projects[i].name);
                        projects[i].stateContentLoad = true;
                        updateLoadingBar();
                        if(projects[i].stateImageLoad === true) {
                            console.log("| loaded project view for " + projects[i].name);
                            projects[i].stateViewLoad = true;
                            appendProjectContentStyle(i);
                            checkProjectViewLoad();
                        }
                        // full res images are only loaded once all content thumbs are present. This slightly reduces the time waiting with the obstructor. Ideally we'd also wait for the other main images to be loaded, but doing so would require too convoluted code in the current state of things. Would be much better with a priority queue.
                        $images.each(function(index, element) {
                            console.log("| requested content full image for " + projects[i].name);
                            var $image = $("<img />").attr("src", $(element).data("src")).on("load", function() {
                                console.log("* loaded content full image for " + projects[i].name);
                                $(element).removeAttr("data-src").attr("src", $image.attr("src"));
                            });
                        });
                    }
                }.bind(i));
            }.bind(i))
            // the code below maintains the obstructor until all content images are loaded
            /*$images.each(function(index, element) {
                $(element).on("load", function() {
                    console.log("* loaded content thumb image for " + projects[i].name);
                    console.log("| requested content full image for " + projects[i].name);
                    $(element).off("load");
                    var $image = $("<img />").attr("src", $(element).data("src")).on("load", function() {
                        console.log("* loaded content full image for " + projects[i].name);
                        $(element).removeAttr("data-src").attr("src", $image.attr("src"));
                    });
                    projects[i].numContentImagesThumbLoad++;
                    if(projects[i].numContentImagesThumbLoad === projects[i].numContentImages) {
                        console.log("| loaded content for " + projects[i].name);
                        projects[i].stateContentLoad = true;
                        updateLoadingBar();
                        if(projects[i].stateImageLoad === true) {
                            console.log("| loaded project view for " + projects[i].name);
                            projects[i].stateViewLoad = true;
                            appendProjectContentStyle(i);
                            checkProjectViewLoad();
                        }
                    }
                }.bind(i));
            }.bind(i));*/
        }
        projects[i].stateContentImagesFullLoading = true;
    })
}

/* The replaceProjectTo... functions are the transition sequences from the collapsed to the expanded form of a project. In the case of replaceProjectToFull(), it also takes care of loading the full project images if they aren't already there. '*/

function replaceProjectToThumb(i) {
    console.log("> replacing to thumb " + projects[i].name);
    projects[i].$.removeClass("full");
    projects[i].$sub.children(".project-content").removeClass("full");
    projects[i].$sub.removeClass("full");
}

function replaceProjectToFull(i) {
    console.log("> replacing to full " + projects[i].name);
    projects[i].$.addClass("full");
    projects[i].$sub.addClass("full");
    if(projects[i].stateContentImagesFullLoading === false) {
        projects[i].stateContentImagesFullLoading = true;
        var $images =  projects[i].$contentsub2.children(".project-content").children("img")
        $images.each(function(index) {
            var $image = $("<img />").attr("src", $(this).data("src")).on("load", function() {
                console.log("* loaded content full image for " + projects[i].name);
                $images.filter("[data-src=\"" + $(this).attr("src") + "\"]").removeAttr("data-src").attr("src", $(this).attr("src"))
            });
        })
    } else {
        projects[i].$sub.addClass("full");
    }
}

function scrollToProject(i) {
    console.log("> scrolling to project " + (i !== -1 ? projects[i].name : "Index"));
    $("html, body").animate({ scrollTop: (i !== -1 ? Math.ceil(projects[i].$.offset().top) : 0) }, 600);
}

function scrollToProjectCallback(i, callback) {
    console.log("> scrolling to project " + (i !== -1 ? projects[i].name : "Index") + " (callback-ed)");
    $("html, body").animate({ scrollTop: (i !== -1 ? Math.ceil(projects[i].$.offset().top) : 0) }, 600).promise().then(function() {callback()});
}

function setInitialScroll() {
    console.log("> setting initial scroll");
    //disableTransitions();
    active = getActiveProject();
    if(active !== -1) {
        var top = Math.ceil(projects[getActiveProject()].$sub.offset().top);
        $("html,body").scrollTop(top);
    }
    enableTransitions();
    $(".obstructor").css("top", "-150vh");
}

/* The disable/enableTransitions() functions are used at document load only to prevent elements from changing around as the user arrives on the site */

function disableProjectTransitions(i) {
    console.log("> disabling transitions for " + projects[i].name);
    projects[i].$.addClass("transition-disable");
    projects[i].$sub.offset();
}

function enableProjectTransitions(i) {
    console.log("> enabling transitions for " + projects[i].name);
    projects[i].$.removeClass("transition-disable");
    projects[i].$sub.offset();
}

function disableTransitions() {
    console.log("> disabling transitions");
    var htmlString = "\n* {\n" +
        "   -webkit-transition: none;\n" + 
        "   transition: none;\n" + 
        "\n}";
    $("<style>").prop("type", "text/css").html(htmlString).prop("id", "transition-disable").appendTo("head");
}

function enableTransitions() {
    console.log("> enabling transitions");
    $("style#transition-disable").remove();
}

/* The next few replace... functions take care of adjusting the url and title bar. They are called by the viewProject() function */

function replaceAddress(newAddress) {
    // avoids creating duplicate entries in history while navigating backwards
    var address = window.location.pathname.split("/").pop().substring(0);
    console.log("> replacing address")
    console.log("| old " + address);
    console.log("| new " + newAddress);
    if (newAddress !== address) {
        console.log("| address replaced");
        history.pushState(null, "", newAddress);
    } else {
        console.log("| address not replaced");
    }
}

function replaceTitle(newActive) {
    if (newActive !== -1) {
        title = projects[newActive].title.text();
        document.title = title;
    } else {
        document.title = "Simon Demeule";
    }
}

/* The next get and set functions are utilities for navigating through project indicies and active states */

function getProjectFromName(name) {
    console.log("> getting project from name");
    console.log("| input name: " + name);
    for (var i = 0; i < projects.length; i++) {
        if (projects[i].name == name) {
            console.log("| extracted index " + i);
            return i;
        }
    }
    console.log("| extracted index -1");
    return -1;
}

function getAddressFromProject(i) {
    if(i !== -1) {
        return "/" + projects[i].name + "/";
    } else {
        return "/";
    }
    
}

function getProjectFromURL() {
    console.log("> getting project from URL");
    name = window.location.pathname;
    console.log("| input URL " + name);
    name = name.substring(1, name.lastIndexOf("/"));
    console.log("| extracted name " + name);
    return getProjectFromName(name);
}

function getActiveProject() {
    for (var i = 0; i < projects.length; i++) {
        if (projects[i].stateViewActive === true) {
            return i;
        }
    }
    return -1;
}

function setActiveProject(newActive) {
    for (var i = 0; i < projects.length; i++) {
        if (i === newActive) {
            projects[i].stateViewActive = true;
        } else {
            projects[i].stateViewActive = false;
        }
    }
}

/* The viewProject() function is called whenever a project is clicked or when the url is changed. It's role is to check to see if the project change is valid (is it already opened?) and to orchestrate the transitions that follow. '*/
function viewProject(newActive, originIsHistory) {
    console.log("> view request for " + (newActive !== -1 ? projects[newActive].name : "Index") + "(origin "+ (originIsHistory ? "" : "non-") + "history)");
    var active = getActiveProject();
    if (active !== newActive) {
        if (newActive !== -1) {
            if (active === -1) {
                console.log("| no previous active project");
                console.log("| transitive load");
                replaceProjectToFull(newActive);
                replaceTitle(newActive);
                scrollToProject(newActive);
                if(!originIsHistory) {
                    replaceAddress(getAddressFromProject(newActive));
                }
                gtag('config', 'UA-113804397-1', {'page_path': '/' + getAddressFromProject(newActive)});
            } else {
                console.log("| previous active project");
                console.log("| transitive close and load");
                replaceProjectToFull(newActive);
                if(newActive > active) {
                    scrollToProjectCallback(newActive, function() {
                        console.log("* scrolling done");
                        replaceTitle(newActive);
                        disableProjectTransitions(active);
                        replaceProjectToThumb(active);
                        $("html,body").scrollTop(projects[newActive].$.offset().top);
                        enableProjectTransitions(active);
                    });
                } else {
                    scrollToProjectCallback(newActive, function() {
                        console.log("* scrolling done");
                        replaceTitle(newActive);
                        disableProjectTransitions(active);
                        replaceProjectToThumb(active);
                        enableProjectTransitions(active);
                    });
                }
                
                if(!originIsHistory) {
                    replaceAddress(getAddressFromProject(newActive));
                }
                gtag('config', 'UA-113804397-1', {'page_path': '/' + getAddressFromProject(newActive)});
            }
        } else {
            console.log("| return to index");
            replaceTitle(newActive);
            replaceProjectToThumb(active);
            if(!originIsHistory) {
                replaceAddress(getAddressFromProject(newActive));
            }
            gtag('config', 'UA-113804397-1', {'page_path': '/' + getAddressFromProject(newActive)});
        }
        setActiveProject(newActive);
    } else {
        console.log("| project already loaded");
    }
    console.log("==== view updated ====");
}

/* These functions are ran initially */

function setInitialUIColor() {
    var topColor, bottomColor;
    var name = window.location.pathname;
    name = name.substring(1, name.lastIndexOf("/"));
    if(name === "/") {
        topColor = $(".top-content").css("background-color");
        bottomColor = $(".top-content").css("color");
        $(".obstructor-loading-bar").css("background-color", topColor);
        $(".obstructor-loading-bar").css("color", bottomColor);
        $(".obstructor").css("background-color", bottomColor);
        $(".obstructor").css("color", topColor);
    } else {
        var $project = $("#" + name);
        if($project.length === 1) {
            $.get("/" + name + "/index.html", function (data) {
                topColor = $(data).filter(".title-style").css("color");
                bottomColor = $(data).filter(".background-style").css("background-color");
                $(".obstructor-loading-bar").css("background-color", topColor);
                $(".obstructor-loading-bar").css("color", bottomColor);
                $(".obstructor").css("background-color", bottomColor);
                $(".obstructor").css("color", topColor);
            });
        }
    }
}

var rem;

function updateRem() {
    rem = $(".rem-tester").height();
}

$(document).ready(function () {
    setInitialUIColor();
    updateRem();
    loadProjectObjects();
});

/* These are all main event functions, most of which trigger viewProject() */

$(".project-sub").click(function (event) {
    viewProject(getProjectFromName($(this).parent().attr("id")), false);
});

var contactInfoStateView = false;

$(".top-contact-button").click(function (event) {
    contactInfoStateView = !contactInfoStateView;
    if(contactInfoStateView) {
        $(".top-contact-info").addClass("full");
    } else {
        $(".top-contact-info").removeClass("full");
    }
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.onpopstate = function (event) {
    if (event.state) {
        // history changed because of pushState/replaceState
    } else {
        // history changed because of a page load
        var name = window.location.pathname;
        name = name.substring(1, name.lastIndexOf("/"));
        viewProject(getProjectFromName(name), true);
    }
}

/* Below are functions that detect the project which the browser is over. It plays the same role as «hover» on the desktop layout. */

/* updateOverProject is the call used for recursion. It is initially called in onAllProjectObjectsLoaded via updateOverProjectTimeout. It is used for recursive delayed scroll checking. */

var updateOverProjectTimeout = null;
var lastOverProject = -1;

function updateOverProject() {
    setOverProject(findOverProject());
}

/* findOverProject takes care of finding which project is in the middle of the screen. */

function findOverProject() {
    var scrollDistance = $(window).scrollTop();
    var screenHeight = $(window).height();
    var i = null;
    $('.project').each(function(j) {
        if ($(this).position().top <= scrollDistance + screenHeight/2) {
            i = j;
        }
    });
    if(i !== null) {
        return i;
    } else {
        return -1;
    }
}

/* setOverProject takes care of styling the middle project, unstyling the previous one, and recursion. */

function setOverProject(newOverProject) {
    if(newOverProject === -1) {
        if(lastOverProject !== -1) {
            $(projects[lastOverProject].$sub).removeClass("over");
            $(projects[lastOverProject].$).removeClass("over");
            console.log("== removed project Over styling");
            lastOverProject = -1;
        }
    } else if(newOverProject !== lastOverProject) {
        // activate Over project
        if(lastOverProject !== -1) {
            $(projects[lastOverProject].$sub).removeClass("over");
            $(projects[lastOverProject].$).removeClass("over");
        }
        $(projects[newOverProject].$sub).addClass("over");
        $(projects[newOverProject].$).addClass("over");
        console.log("== set Over project styling on " + projects[newOverProject].name);
        lastOverProject = newOverProject;
    }
    updateOverProjectTimeout = setTimeout(updateOverProject, 100);
}

/* broken for now

$(window).resize(function() {
    resizeDebouncer();
})
    
var resizeTimeout;
    
function resizeDebouncer() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(recalculateContentStyles
    , 50);
}*/