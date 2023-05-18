MODULES.pages = {
    init: function () {
        console.log('JS PAGE Ready');
        // Home - module giraffes drag to reveal images
        this.twoGiraffes();

        // Home - module quiz click to show answer
        this.quizToggle();
    },
    twoGiraffes: function () {
        // check module exist
        if($('.module-giraffes').length) {
            var dragActive = false,
            posX01 = 0,
            posX02 = 0,
            posMove = 0,
            expandW = (window.innerWidth - $('.container').outerWidth())/2 - 35,
            anchorCenter = $('.drag-line').offset().left + 3,
            anchorRange = $('.giraffe-item').outerWidth(),
            anchorLeft = 0, // anchorCenter - anchorRange - expandW
            anchorRight = 0, // anchorCenter + anchorRange + expandW
            anchorCurrent = anchorCenter,
            dragCurrent = parseFloat($('.drag-line').attr('data-move')),
            gWhiteWidth = parseFloat($('.giraffe-item[data-type*="white"] .after').attr('data-width')),
            gBlackWidth = parseFloat($('.giraffe-item[data-type*="black"] .after').attr('data-width'));


        $(window).on('resize load', function() {
            if(window.innerWidth > 1024) {
                expandW = (window.innerWidth - $('.container').outerWidth())/2 - 35;
            } else {
                expandW = (window.innerWidth - $('.container').outerWidth())/2;
            }
                anchorLeft = anchorCenter - anchorRange - expandW;
                anchorRight = anchorCenter + anchorRange + expandW;
        });

        var posStart = function (el) {
            if($(el.target).hasClass('drag-button')) {
                $('.drag-line').removeClass('roll-back');
                dragActive = true;
                posX01 = el.pageX !== undefined ? el.pageX : el.changedTouches[0].pageX;
            }
        }

        var posStop = function () {
            if(dragActive) {
                let anchorMax = 0;

                if(anchorCurrent <= anchorRight && anchorCurrent >= anchorLeft) {
                    $('.drag-line').attr('data-move', dragCurrent + posMove);

                    let gWhiteWidthStop = gWhiteWidth + ((dragCurrent + posMove)/anchorRange * 100),
                        gBlackWidthStop = gBlackWidth + (-(dragCurrent + posMove)/anchorRange * 100);

                    // console.log('gWhiteWidthStop', gWhiteWidthStop);
                    // console.log('gBlackWidthStop', gBlackWidthStop);

                    if(gWhiteWidthStop > 30) {
                        anchorMax = anchorRight - anchorCenter;
                    }

                    if(gBlackWidthStop > 30) {
                        anchorMax = anchorLeft - anchorCenter;
                    }

                    $('.drag-line').addClass('roll-back').css({
                        'transform': 'translateX('+(anchorMax)+'px)'
                    }).attr('data-move', anchorMax);
                    giraffesElementsAnimation(anchorMax, 0);
                    
                    setTimeout(function() {
                        $('.giraffe-item[data-type*="white"] .after').attr('data-width', gWhiteWidthStop);
                        $('.giraffe-item[data-type*="black"] .after').attr('data-width', gBlackWidthStop);
                    }, 1);
                } else {
                    if(anchorCurrent > anchorRight) anchorMax = anchorRight - anchorCenter;
                    if(anchorCurrent < anchorLeft) anchorMax = anchorLeft - anchorCenter;

                    $('.drag-line').addClass('roll-back').css({
                        'transform': 'translateX('+(anchorMax)+'px)'
                    }).attr('data-move', anchorMax);
                }
                
                dragActive = false;
            }
        }

        var giraffesElementsAnimation = function (dragCurrent, posMove) {
            $('.giraffe-item[data-type*="white"] .before').css({
                'opacity': +(gWhiteWidth + (1 - (dragCurrent + posMove)/anchorRange * -1.5))
            });

            $('.giraffe-item[data-type*="white"] .after').css({
                'width': +(gWhiteWidth + ((dragCurrent + posMove)/anchorRange * 100))+'%'
            });

            $('.giraffe-item[data-type*="white"] .after-pattern').css({
                'width': +(gWhiteWidth + ((dragCurrent + posMove)/anchorRange * 100))+'%'
            });
            
            $('.giraffe-item[data-type*="black"] .before').css({
                'opacity': +(gBlackWidth + (1 - (dragCurrent + posMove)/anchorRange * 1.5))
            });

            $('.giraffe-item[data-type*="black"] .after').css({
                'width': +(gBlackWidth + (-(dragCurrent + posMove)/anchorRange * 100))+'%'
            });

            $('.giraffe-item[data-type*="black"] .after-pattern').css({
                'width': +(gBlackWidth + (-(dragCurrent + posMove)/anchorRange * 100))+'%'
            });
        }

        var posMoving = function (el) {
            if(dragActive) {
                posX02 = el.pageX !== undefined ? el.pageX : el.changedTouches[0].pageX;
                posMove = posX02 - posX01;

                anchorCurrent = $('.drag-line').offset().left + 3;
                
                if(anchorCurrent <= anchorRight && anchorCurrent >= anchorLeft) {
                    dragCurrent = parseFloat($('.drag-line').attr('data-move'));

                    $('.drag-line').css({
                        'transform': 'translateX('+(dragCurrent + posMove)+'px)'
                    });

                    giraffesElementsAnimation(dragCurrent, posMove);
                }
            }
        }

        $(document).on('mousedown touchstart', function(el) {
            posStart(el);
        });

        $(document).on('mouseup touchend', function() {
            posStop();
        });

        $(document).on('mousemove touchmove', function(el) {
            posMoving(el);
        });
        }
    },
    quizToggle: function () {
        $(document).on('click touch', '.input-radio-wrap input', function() {
            let el = $(this),
                elVal = el.val();

                el.closest('.quiz-item').addClass('answered');
                el.closest('.quiz-item').find('.quiz-hint-wrap .quiz-hint[data-type*="'+elVal+'"]').addClass('active').siblings('.quiz-hint').removeClass('active');
        });
    }
};

// Initialize module:
MODULES.pages.init();

