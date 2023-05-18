MODULES.loadImages = {
    init: function () {
        var lazyLoadInstance = new LazyLoad({
            // Your custom settings go here
            elements_selector: ".lazy-img, .img-bg-cover"
        });

        lazyLoadInstance.update();
    }
}

// Init Module after DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    MODULES.loadImages.init();
});
