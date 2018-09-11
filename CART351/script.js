// created by simon demeule

var contactInfoStateView = false;

$(".top-contact-button").click(function (event) {
    contactInfoStateView = !contactInfoStateView;
    if(contactInfoStateView) {
        $(".top-contact-info").addClass("full");
    } else {
        $(".top-contact-info").removeClass("full");
    }
});

$(".top-portfolio-button").click(function(event) {
    $(".obstructor").css("top", "0");
    setTimeout(function() {
        $(".obstructor").css("top", "150vh"); // necessary to prevent glitch on safari history changes
        window.location.href = "/"
    }, 1000);
})