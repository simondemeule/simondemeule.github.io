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
        window.location.href = "/"
    }, 1000);
})

window.onpageshow = function(event) {
    $(".obstructor").css("top", "100vh");
}