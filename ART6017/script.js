window.onload = function() {
    let wrapper = document.getElementsByClassName("main headline invert initial")[0]

    wrapper.classList.remove("initial")
    wrapper.classList.add("wrapper")

    let inner = wrapper.innerHTML
    wrapper.innerHTML = ""
    
    let text = document.createElement("div")
    text.classList.add("main")
    text.classList.add("headline")
    text.classList.add("invert")
    text.classList.add("text")
    let background = document.createElement("div")
    background.classList.add("main")
    background.classList.add("headline")
    background.classList.add("invert")
    background.classList.add("background")

    text.innerHTML = inner

    wrapper.appendChild(text)
    wrapper.appendChild(background)

    background.style.width = text.clientWidth + "px"
    background.style.height = text.clientHeight + "px"
    background.style.marginLeft = - text.marginLeft + "px"
}