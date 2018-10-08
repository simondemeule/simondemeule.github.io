(function($) {
    $(document).ready(function() {
        console.log($);
        $('a[href^="#"]').bind('click', function(e) {
            e.preventDefault(); // prevent hard jump, the default behavior
            onPostLinkClick($(this).attr("href"), this);
            return false;
        });
        
        $(".top-bar-button").click(function() {
            toggleMenuView();
        });
        
        $(window).resize(function() {
            resizeDebouncer();
        })
        
        var resizeTimeout;
        
        function resizeDebouncer() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateMenuButtonView, 50);
        }
        
        updatePostLinks();
        updateMenuButtonView();
        
        function updatePostLinks() {
            highlightPostLink(findPostInView());
        };
        
        function findPostInView() {
            var scrollDistance = $(window).scrollTop();

            // Assign active class to nav links while scolling
            var j = null;
            $('.content-title').each(function(i) {
                if ($(this).position().top <= scrollDistance) {
                    j = i;
                }
            });
            if(j !== null) {
                return $('.top-bar-element-container a').eq(j);
            } else {
                return -1;
            }
        };
        
        var $lastActivePostLink = -1;
        var postLinkTimeout = null;
                                     
        function highlightPostLink($newActivePostLink) {
            if($newActivePostLink === -1) {
                if($lastActivePostLink !== -1) {
                    $('.top-bar-element-container a.active').removeClass('active');
                    $lastActivePostLink = -1;
                }
                postLinkTimeout = setTimeout(function(){updatePostLinks()}, 200);
            } else if($newActivePostLink !== $lastActivePostLink) {
                $('.top-bar-element-container a.active').removeClass('active');
                $newActivePostLink.addClass('active');
                if($newActivePostLink.position().top > $('.top-bar').height() - 1) {
                    // check if the button is below the frame, and if it is, scroll it in view.
                    alignPostLink($newActivePostLink);
                    postLinkTimeout = setTimeout(function(){updatePostLinks()}, 700);
                } else if($newActivePostLink.position().top < $('.top-bar').position().top) {
                    // check if the button is below the frame, and if it is, scroll it in view.
                    alignPostLink($newActivePostLink);
                    postLinkTimeout = setTimeout(function(){updatePostLinks()}, 700);
                } else {
                    postLinkTimeout = setTimeout(function(){updatePostLinks()}, 200);
                }
                $lastActivePostLink = $newActivePostLink;
            } else {
                postLinkTimeout = setTimeout(function(){updatePostLinks()}, 200);
            }
        }
        
        function onPostLinkClick($target, $sourceLink) {
            clearTimeout(postLinkTimeout);
            postLinkTimeout = setTimeout(function() {updatePostLinks()}, 700);
            closeMenuView();
            alignPostLink($sourceLink);
            $('.top-bar-element-container a.active').removeClass('active');
            $($sourceLink).addClass("active");
            $('html, body').stop().animate({
                    scrollTop: $($target).offset().top + 2
                }, 600, function() {
            });
            
        }
        
        function alignPostLink($postLink) {
            if($postLink !== -1) {
                var value = (parseFloat($('.top-bar-element-container').css("margin-top"))-$($postLink).position().top) + "px";
                $('.top-bar-element-container').css("margin-top", value);
            }
        }
        
        var menuView = false;
        
        function closeMenuView() {
            if(menuView) {
                $(".top-bar-button-element").removeClass("active");
                $(".top-bar").css("height", "");
                menuView = false;
            }
        }
        
        function toggleMenuView() {
            if(menuView) {
                $(".top-bar-button-element").removeClass("active");
                $(".top-bar").css("height", "");
                alignPostLink(findPostInView());
                menuView = false;
            } else {
                $(".top-bar-button-element").addClass("active");
                $('.top-bar-element-container').css("margin-top", "");
                $(".top-bar").css("height", $(".top-bar-element-container").height() + "px");
                menuView = true;
            }
        }
        
        function updateMenuButtonView() {
            if($('.top-bar-element-container').height() - 5 < $(".top-bar").height()) {
                $(".top-bar-button").css("visibility", "hidden");
            } else {
                $(".top-bar-button").css("visibility", "visible");
            }
        }
    });
})( jQuery );