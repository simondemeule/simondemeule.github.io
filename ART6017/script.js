function View() {
    let view = this

    let canvas = this.canvas
    let context = this.context

    this.parallaxStrengthBackground = 0.3
    this.parallaxStrengthForeground = 0.6
    this.parallaxFactor = 0

    this.ratioClient = 0
    this.ratioForegroundEffective = 0
    this.ratioBackgroundEffective = 0
    this.imageForegroundRect = {}
    this.imageForegroundRect.x = 0
    this.imageForegroundRect.y = 0
    this.imageForegroundRect.width = 0
    this.imageForegroundRect.height = 0
    this.imageBackgroundRect = {}
    this.imageBackgroundRect.x = 0
    this.imageBackgroundRect.y = 0
    this.imageBackgroundRect.width = 0
    this.imageBackgroundRect.height = 0

    this.isReadyContext = false
    this.isReadyImageBackground = false
    this.isReadyImageForeground = false
    this.isReadyImageBackgroundTemp = false
    this.isReadyImageForegroundTemp = false

    this.imageForegroundCurrent = null
    this.imageBackgroundCurrent = null

    // marks canvas size as due for change
    // this causes a call which cascades through all methods called by dirty flags below
    this.isDirtyCanvasSize = false

    // marks global image positions for recalculation on next animation frame
    // this causes a call which cascades through all methods called by dirty flags below
    this.isDirtyPositionsGlobal = true

    // marks vertical image positions for recalculation on next animation frame
    // this causes a call which cascades through all methods called by dirty flags below
    this.isDirtyPositionsVertical = true

    // marks canvas for redraw on next animation frame
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
            view.handleImageLoad()
        }
        view.imageForeground.onload = function() {
            view.isReadyImageForeground = true
            view.handleImageLoad()
        }
        view.imageBackgroundTemp.onload = function() {
            view.isReadyImageBackgroundTemp = true
            view.handleImageLoad()
        }
        view.imageForegroundTemp.onload = function() {
            view.isReadyImageForegroundTemp = true
            view.handleImageLoad()
        }

        view.imageBackground.src = "background.jpg"
        view.imageForeground.src = "foreground.jpg"
        view.imageBackgroundTemp.src = "data:image/png;base64,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"
        view.imageForegroundTemp.src = "data:image/png;base64,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"
    }

    this.handleImageLoad = function() {
        if(view.isReadyImageForeground && view.isReadyImageBackground) {
            view.canvas.style.filter = "blur(0px)"
            view.imageBackgroundCurrent = view.imageBackground
            view.imageForegroundCurrent = view.imageForeground
        }
        view.isDirtyPositionsGlobal = true
    }

    this.handleScroll = function() {
        view.isDirtyPositionsVertical = true
    }

    this.handleResize = function() {
        view.isDirtyCanvasSize = true
    }

    // creates context
    this.createContext = function() {
        view.canvas = document.getElementById('canvas')
        view.context = view.canvas.getContext('2d')
        
        view.updatePixelRatio()
        view.updateCanvasSize()

        // TODO: figure out proper handlers for canvas context load completion
        view.isReadyContext = true
    }

    // get pixel ratio
    this.updatePixelRatio = function() {
        var backingStore = view.context.backingStorePixelRatio ||
            view.context.webkitBackingStorePixelRatio ||
            view.context.mozBackingStorePixelRatio ||
            view.context.msBackingStorePixelRatio ||
            view.context.oBackingStorePixelRatio ||
            view.context.backingStorePixelRatio || 1
        view.pixelRatio = (window.devicePixelRatio || 1) / backingStore
    }

    this.updateCanvasSize = function() {
        if(view.canvas !== undefined) {
            view.canvas.style.width = window.innerWidth + "px"
            view.canvas.style.height = window.innerHeight + "px"
            view.canvas.width = view.pixelRatio * window.innerWidth
            view.canvas.height = view.pixelRatio * window.innerHeight
        }

        view.updatePositionsGlobal()
    }

    this.updatePositionsGlobal = function() {
        view.ratioClient = window.innerWidth / window.innerHeight

        if(view.imageBackgroundCurrent != null) {
            view.ratioBackgroundEffective = view.imageBackgroundCurrent.width / (view.imageBackgroundCurrent.height / (1 + view.parallaxStrengthBackground))

            if(view.ratioClient < view.ratioBackgroundEffective) {
                view.imageBackgroundRect.height = window.innerHeight * view.pixelRatio * (1 + view.parallaxStrengthBackground)
                view.imageBackgroundRect.width = view.imageBackgroundRect.height * view.imageBackgroundCurrent.width / view.imageBackgroundCurrent.height
                view.imageBackgroundRect.x = - (view.imageBackgroundRect.width - window.innerWidth * view.pixelRatio) / 2
            } else {
                view.imageBackgroundRect.width = window.innerWidth * view.pixelRatio
                view.imageBackgroundRect.height = view.imageBackgroundRect.width * view.imageBackgroundCurrent.height / view.imageBackgroundCurrent.width
                view.imageBackgroundRect.x = - (view.imageBackgroundRect.width - window.innerWidth * view.pixelRatio) / 2
            }
        }

        if(view.imageForegroundCurrent != null) {
            view.ratioForegroundEffective = view.imageForegroundCurrent.width / (view.imageForegroundCurrent.height / (1 + view.parallaxStrengthForeground))
        
            if(view.ratioClient < view.ratioForegroundEffective) {
                view.imageForegroundRect.height = window.innerHeight * view.pixelRatio * (1 + view.parallaxStrengthForeground)
                view.imageForegroundRect.width = view.imageForegroundRect.height * view.imageForegroundCurrent.width / view.imageForegroundCurrent.height
                view.imageForegroundRect.x = - (view.imageForegroundRect.width - window.innerWidth * view.pixelRatio) / 2
            } else {
                view.imageForegroundRect.width = window.innerWidth * view.pixelRatio
                view.imageForegroundRect.height = view.imageForegroundRect.width * view.imageForegroundCurrent.height / view.imageForegroundCurrent.width
                view.imageForegroundRect.x = - (view.imageForegroundRect.width - window.innerWidth * view.pixelRatio) / 2
            }
        }

        view.updatePositionsVertical()
    }

    this.updatePositionsVertical = function() {
        view.parallaxFactor = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)
        if(isNaN(view.parallaxFactor)) {
            // this happens if the page can't be scrolled through
            view.parallaxFactor = 0
        }

        if(view.imageBackgroundCurrent != null) {
            view.imageBackgroundRect.y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthBackground * view.parallaxFactor
        }
        if(view.imageForegroundCurrent != null) {
            view.imageForegroundRect.y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthForeground * view.parallaxFactor
        }
    }

    // render!
    this.renderModel = function(model) {
        if(model.isReady && view.isReadyContext) {
            if (view.isDirtyCanvasSize) {
                view.updateCanvasSize()
                view.isDirtyCanvasSize = false
                view.isDirty = true
            } if (view.isDirtyPositionsGlobal) {
                view.updatePositionsGlobal()
                view.isDirtyPositionsGlobal = false
                view.isDirty = true
            } else if (view.isDirtyPositionsVertical) {
                view.updatePositionsVertical()
                view.isDirtyPositionsVertical = false
                view.isDirty = true
            }

            if (view.isDirty) {
                view.isDirty = false

                view.context.fillStyle = "#000000"

                view.context.fillRect(0, 0, window.innerWidth * view.pixelRatio, window.innerHeight * view.pixelRatio)

                if(view.imageBackgroundCurrent != null) {
                    view.context.drawImage(view.imageBackgroundCurrent, view.imageBackgroundRect.x, view.imageBackgroundRect.y, view.imageBackgroundRect.width, view.imageBackgroundRect.height)
                }

                // setup clipping window
                view.context.save()

                view.context.beginPath()
                
                for(let i = 0; i < model.tabs.length; i++) {
                    rect = model.tabs[i].getBoundingClientRect()

                    if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                        view.context.rect(rect.x * view.pixelRatio, rect.y * view.pixelRatio, rect.width * view.pixelRatio, rect.height * view.pixelRatio)
                    }
                }

                for(let i = 0; i < model.headlines.length; i++) {
                    rect = model.headlines[i].getBoundingClientRect()

                    if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                        view.context.rect(rect.x * view.pixelRatio, rect.y * view.pixelRatio, rect.width * view.pixelRatio, rect.height * view.pixelRatio)
                    }
                }

                for(let i = 0; i < model.quotes.length; i++) {
                    rect = model.quotes[i].getBoundingClientRect()

                    if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                        view.context.rect(rect.x * view.pixelRatio, rect.y * view.pixelRatio, rect.width * view.pixelRatio, rect.height * view.pixelRatio)
                    }
                }

                view.context.closePath()

                view.context.clip()

                if(view.imageForegroundCurrent != null) {
                    view.context.drawImage(view.imageForegroundCurrent, view.imageForegroundRect.x, view.imageForegroundRect.y, view.imageForegroundRect.width, view.imageForegroundRect.height)
                }

                view.context.restore()
            } else {
                // do something that forces safari to not unprioritize canvas ???
            }
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
            controller.view.handleScroll()
        }
        window.onresize = function() {
            controller.view.handleResize()
        }
       window.requestAnimationFrame(controller.update)
    }

    this.update = function() {
        controller.view.renderModel(controller.model)
        window.requestAnimationFrame(controller.update)
    }
}

let controller = new Controller()
window.onload = controller.initialize