function View() {
    let view = this

    let canvas = this.canvas
    let context = this.context

    this.lastWidth = 0
    this.lastHeight = 0

    this.parallaxStrengthBackground = 0.1
    this.parallaxStrengthForeground = 0.3
    this.parallaxFactor = 0

    this.isReadyContext = false
    this.isReadyImageBackground = false
    this.isReadyImageForeground = false
    this.isReadyImageBackgroundTemp = false
    this.isReadyImageForegroundTemp = false

    this.isDirty = true

    // initialize
    this.initialize = function() {
        view.createContext()

        view.imageBackground = new Image()
        view.imageForeground = new Image()
        view.imageBackgroundTemp = new Image()
        view.imageForegroundTemp = new Image()

        view.imageBackground.onload = function() {
            view.isReadyImageBackground = true
            view.isDirty = true // this will be annoying
        }
        view.imageForeground.onload = function() {
            view.isReadyImageForeground = true
            view.isDirty = true // this will be annoying
        }
        view.imageBackgroundTemp.onload = function() {
            view.isReadyImageBackgroundTemp = true
            view.isDirty = true // this will be annoying
        }
        view.imageForegroundTemp.onload = function() {
            view.isReadyImageForegroundTemp = true
            view.isDirty = true // this will be annoying
        }

        view.imageBackground.src = "backdrop.jpg"
        view.imageForeground.src = "backdropInvertedAlt.jpg"
        /*
        view.imageBackgroundTemp.src = "backdropTemp.png"
        view.imageForegroundTemp.src = "backdropTempInverted.png"
        */
        view.imageBackgroundTemp.src = "data:image/png;base64,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"
        view.imageForegroundTemp.src = "data:image/png;base64,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"

    }

    // set as dirty
    this.invalidate = function() {
        view.isDirty = true
    }

    // creates context
    this.createContext = function() {
        view.canvas = document.getElementById('canvas')
        view.context = view.canvas.getContext('2d')
        view.pixelRatio = view.getPixelRatio()

        view.updateScalingSubroutine()

        // TODO: figure out proper handlers for canvas context load completion
        view.isReadyContext = true
    }

    // get pixel ratio
    this.getPixelRatio = function() {
        var backingStore = view.context.backingStorePixelRatio ||
            view.context.webkitBackingStorePixelRatio ||
            view.context.mozBackingStorePixelRatio ||
            view.context.msBackingStorePixelRatio ||
            view.context.oBackingStorePixelRatio ||
            view.context.backingStorePixelRatio || 1
        return (window.devicePixelRatio || 1) / backingStore
    }

    // update the scaling of view elements, but only if the window dimensions have changed
    this.updateScaling = function(model = null) {
        let width = window.innerWidth
        let height = window.innerHeight

        if(view.lastWidth !== width || view.lastHeight !== height) {
            view.isDirty = true

            view.lastWidth = width
            view.lastHeight = height

            view.updateScalingSubroutine()
        }
    }

    // update the scaling of view elements
    this.updateScalingSubroutine = function() {
        if(view.canvas !== undefined) {
            view.canvas.style.width = window.innerWidth + "px"
            view.canvas.style.height = window.innerHeight + "px"
            view.canvas.width = view.pixelRatio * window.innerWidth
            view.canvas.height = view.pixelRatio * window.innerHeight
        }
        view.updateParallax()
    }

    this.updateParallax = function() {
        view.parallaxFactor = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)
    }

    // render!
    this.renderModel = function(model) {
        if(model.isReady && view.isReadyContext && view.isDirty) {
            
            /*
            view.context.fillStyle = "#FFFFFF"

            view.context.fillRect(0, 0, window.innerWidth * view.pixelRatio, window.innerHeight * view.pixelRatio)
            */

            // TODO: move calculations to model
            
            let image = null
            if(view.isReadyImageBackground) {
                image = view.imageBackground
            } else if(view.isReadyImageBackgroundTemp) {
                image = view.imageBackgroundTemp
            }

            if(image != null) {
                let ratioClient = window.innerWidth / window.innerHeight
                let ratioImageEffective = image.width / (image.height / (1 + view.parallaxStrengthBackground))

                let x = 0
                let y = 0
                let width = 0
                let height = 0
                if(ratioClient < ratioImageEffective) {
                    height = window.innerHeight * view.pixelRatio * (1 + view.parallaxStrengthBackground)
                    width = height * view.imageBackgroundTemp.width / view.imageBackgroundTemp.height
                    x = - (width - window.innerWidth * view.pixelRatio) / 2
                    y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthBackground * view.parallaxFactor
                } else {
                    width = window.innerWidth * view.pixelRatio
                    height = width * image.height / image.width
                    x = - (width - window.innerWidth * view.pixelRatio) / 2
                    y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthBackground * view.parallaxFactor
                }
                view.context.drawImage(image, x, y, width, height)
            }

            // setup clipping window
            view.context.save()

            view.context.beginPath()
            
            for(let i = 0; i < model.tabs.length; i++) {
                rect = model.tabs[i].getBoundingClientRect()

                if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                    view.context.rect(Math.ceil(rect.x * view.pixelRatio), Math.ceil(rect.y * view.pixelRatio), Math.ceil(rect.width * view.pixelRatio), Math.ceil(rect.height * view.pixelRatio))
                }
            }

            for(let i = 0; i < model.headlines.length; i++) {
                rect = model.headlines[i].getBoundingClientRect()

                if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                    view.context.rect(Math.ceil(rect.x * view.pixelRatio), Math.ceil(rect.y * view.pixelRatio), Math.ceil(rect.width * view.pixelRatio), Math.ceil(rect.height * view.pixelRatio))
                }
            }

            for(let i = 0; i < model.quotes.length; i++) {
                rect = model.quotes[i].getBoundingClientRect()

                if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                    view.context.rect(Math.ceil(rect.x * view.pixelRatio), Math.ceil(rect.y * view.pixelRatio), Math.ceil(rect.width * view.pixelRatio), Math.ceil(rect.height * view.pixelRatio))
                }
            }

            view.context.closePath()

            view.context.clip();

            image = null
            if(view.isReadyImageForeground) {
                image = view.imageForeground
            } else if(view.isReadyImageForegroundTemp) {
                image = view.imageForegroundTemp
            }

            if(image != null) {
                let ratioClient = window.innerWidth / window.innerHeight
                let ratioImageEffective = image.width / (image.height / (1 + view.parallaxStrengthForeground))

                let x = 0
                let y = 0
                let width = 0
                let height = 0
                if(ratioClient < ratioImageEffective) {
                    height = window.innerHeight * view.pixelRatio * (1 + view.parallaxStrengthForeground)
                    width = height * view.imageBackgroundTemp.width / view.imageBackgroundTemp.height
                    x = - (width - window.innerWidth * view.pixelRatio) / 2
                    y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthForeground * view.parallaxFactor
                } else {
                    width = window.innerWidth * view.pixelRatio
                    height = width * image.height / image.width
                    x = - (width - window.innerWidth * view.pixelRatio) / 2
                    y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthForeground * view.parallaxFactor
                }
                view.context.drawImage(image, x, y, width, height)
            }

            view.context.restore()

            // this is gross, performance wise, but safari lags unacceptably when the view becomes dirty again, dropping way too many frames
            //view.isDirty = false
        }
    }
}

function Model() {
    let model = this

    this.isReady = false

    this.initialize = function() {
        model.tabs = document.getElementsByClassName("tab instance")
        model.headlines = document.getElementsByClassName("headline")
        model.quotes = document.getElementsByClassName("content quote")
        model.isReady = true
    }

    // TODO: update method for parallax offsets
}

function Controller() {
    let controller = this

    this.initialized = false

    this.initialize = function() {
        controller.view = new View()
        controller.view.initialize()
        controller.model = new Model()
        controller.model.initialize()

        window.onscroll = function() {
            controller.view.invalidate()
            controller.view.updateParallax()
        }
        /*
        window.onmousemove = function() {
            controller.view.invalidate()
        }
        */
        window.requestAnimationFrame(controller.update)
    }

    this.update = function() {
        controller.view.updateScaling()
        controller.view.renderModel(controller.model)
        window.requestAnimationFrame(controller.update);
    }
}

let controller = new Controller()
window.onload = controller.initialize