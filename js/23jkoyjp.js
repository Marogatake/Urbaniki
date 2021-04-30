// source --> https://www.urbaniki.com/wp-content/plugins/sitepress-multilingual-cms/res/js/cookies/language-cookie.js?ver=4.4.9 
jQuery(function () {
    jQuery.each(wpml_cookies, function (cookieName, cookieData) {
        jQuery.cookie(cookieName, cookieData.value, {
            'expires': cookieData.expires,
            'path'   : cookieData.path
        });
    });
});
// source --> https://www.urbaniki.com/wp-content/plugins/visual-product-configurator-modern-skin/public/js/vpc-msl-public.js?ver=1.7 
(function ($) {
  'use strict';

  $(document).ready(function () {


    if($(".vpc-configurator").length) {

        var configurator_parents = $("#vpc-container").parents();

        configurator_parents.each(function() {
            if($(this).css("overflow").toLowerCase() == 'hidden')
              $(this).css("overflow", "visible");
        });

    }


    if(typeof vpc!="undefined"){
      if(typeof(vpc.config["components-aspect"]!="undefined")&& vpc.config["components-aspect"]=="opened")
      {
        $(".vpc-component-header").addClass("component-open");
      }
    }

    $(document).on("click", ".vpc-component-header", function (e) {
      var $this = $(this), $thisOptions = $(this).next();
      if(typeof(vpc.config["components-behavior-on-click"]!="undefined")&& vpc.config["components-behavior-on-click"]=="close-others") {
        $('.vpc-component-header').removeClass("component-open");
      }
      $this.toggleClass("component-open");

    });

    if (window.matchMedia("(min-width: 350px) and (max-width: 800px").matches) {

      $(".VPC_Modern_Skin #vpc-bottom-limit").after($(".vpc-action-buttons"));
      $(".VPC_Modern_Skin .vpc-action-buttons").after($("#debug"));

    }
    // Change the text's font on the preview when the font family is changed by the user.
    $(document).on("change", '.font-selector', function ()
    {
      var current_font = $(this).val();
      var field_id = $(this).data('field');
      var field_datas = vpc.text_settings[field_id];
      var hidden_id = field_datas.hidden_field_id;
      var color = $(this).parents('.vpc-textfield').find("input[id$='-color-selector']:checked").next('label').data('color');
      $('#' + field_datas.container).css('font-family', current_font);
      vpc_msl_get_text_properties(current_font, color, hidden_id);
    });
  });
  
// Function to get the text properties.
function vpc_msl_get_text_properties(font, color, hidden_id) {
  var properties = "font-family: <span>" + font + "</span> <br> color : <span>" + color + "</span>";
  $('#' + hidden_id).val(properties);
}
}(jQuery));
// source --> https://www.urbaniki.com/wp-content/plugins/visual-product-configurator-multiple-views-addon/public/js/vpc-mva-public.js?ver=2.9 
(function ($) {
  'use strict';
  $(document).ready(function () {

    if (typeof vpc !== 'undefined') {
      /*
      *  preview builder process
      *
      */
      wp.hooks.addFilter('vpc.default_preview_builder_process', function () {
        if (vpc.views)
        return false;
        else
        return true;
      });

      /*
      * buid preview
      *
      */
      wp.hooks.addAction('vpc.default_preview_builder_process', function (items_selected) {
        if (typeof active_views != "undefined")
        get_finish_image_by_view(items_selected);
      });

      /*
      * buid preview in ajax mode
      *
      */
      wp.hooks.addAction('vpc.ajax_loading_complete', function () {
        var items = vpc.vpc_selected_items_selector;
        setTimeout(function () {
          if (typeof active_views != "undefined") {
            get_finish_image_by_view(items);
          }
          vpc_mva_get_preview_height();
        }, 2000);
      });

      /**
      *
      * load slide
      */
      var should_process = wp.hooks.applyFilters('vpc_mva.create_vpc_preview_zone', true);

      if (should_process) {
        $('.bxslider').bxSlider({
          pagerCustom: '#mva-bx-pager',
          infiniteLoop: true,
          mode: 'fade', 
          //adaptiveHeight: true,
          //touchEnabled: false,
         // preventDefaultSwipeY: false,
         // preventDefaultSwipeX: false,
         // controls: false,
         // autoControls: false,
        });
      } else {
        wp.hooks.doAction('vpc_mva.create_vpc_preview_zone', active_views);
      }
    }


    /*
    *
    */

    $('a.pager-prev').click(function () {
      var current = slider.getCurrentSlide();
      slider.goToPrevSlide(current) - 1;
    });

    $('a.pager-next').click(function () {
      var current = slider.getCurrentSlide();
      slider.goToNextSlide(current) + 1;
    });

    var current_imgs_by_view;
    function get_finish_image_by_view(items) {
      var decoded_active_views = JSON.parse(active_views);
      var imgs_by_view = [];
      var recap = $('#vpc-container').find(':input').serializeJSON();
      var process = wp.hooks.applyFilters('vpc_mva.get_finish_image_by_view', true);
      if (process) {
        $.each(decoded_active_views, function (index, value) {
          var items_view_selected = [];
          var id = "#vpc-preview" + index;
          $('.vpc-preview').not('.bx-clone').find(id).html("");
          $(items).each(function () {
            if ($(this).attr("data-" + value))
            {
              $('.vpc-preview').not('.bx-clone').find(id).append("<img src='" + $(this).attr("data-" + value) + "' style='z-index:" + $(this).attr("data-index") + "'>");
              items_view_selected.push($(this).attr("data-" + value));
            }
          });
          var items_view = [index, items_view_selected];
          imgs_by_view.push(items_view);
        });
        current_imgs_by_view = imgs_by_view;
        var base_price = 0;
        if ($("#vpc-add-to-cart").length)
        base_price = $("#vpc-add-to-cart").data("price");

        if (vpc.decimal_separator = ',')
        var price = parseFloat(base_price.toString().replace(',', '.'));
        else
        var price = parseFloat(base_price);
        if (!price)
        price = 0;
        var form_data = $('form.formbuilt').serializeJSON();
        var form_price = get_form_total('form.formbuilt', form_data);
        $(vpc.vpc_selected_items_selector).each(function ()
        {
          var option_price = $(this).data("price");
          if (option_price)
          price += parseFloat(option_price);
        });
        price +=form_price;
        price = wp.hooks.applyFilters('vpc.total_price', price);
        $("#vpc-price").html(accounting.formatMoney(price));
      } else {
        wp.hooks.doAction('vpc_mva.get_finish_image_by_view', items);
      }
    }

    if (typeof vpc !== 'undefined') {
      wp.hooks.addAction('vpc.option_change', function (elt, e) {
        vpc_mva_get_preview_height();
      });
    }


    $(window).load(function () {
      vpc_mva_get_preview_height();
    });

    function vpc_mva_get_preview_height() {
      setTimeout(function () {
        var maxHeight = Math.max.apply(null, $(".bx-viewport .vpc-preview ").map(function ()
        {
          return $(this).height();
        }).get());
        $('.bx-viewport').css({height: maxHeight});

      }, 200);
    }

    if (typeof active_views != "undefined") {
      $(document).on("click", ".vpc-component", function (e) {
        var view_to_focus = $(this).data('component-focus');
        if (view_to_focus !== "none" && view_to_focus.length > 0) {
          var current_view = $('#mva-bx-pager').find('.bx-pager a.bx-pager-link.active').data('view');
          if (typeof current_view != "undefined" && current_view.length > 0) {
            if (view_to_focus.toLowerCase() !== current_view.toLowerCase()) {
              $('#mva-bx-pager .bx-pager ').find("a[data-view=" + view_to_focus + "]").trigger("click");
            }
          }
        }
      });
    }
    
    function get_form_total(form_id, fields) {
            var total_price = 0;
            $(form_id).find('[name]').each(function (index, value) {
                var that = $(this),
                        name = that.attr('name'),
                        type = that.prop('type');
                if (type == 'select-one') {
                    $(that).find('[value]').each(function (index, value) {
                        var option = $(this);
                        var price = option.attr('data-price');
                        var value = option.attr('value');
                        for (var i in fields) {
                            if (name == i && value == fields[i]) {
                                if (undefined !== price && '' !== price) {

                                    total_price += parseFloat(price);
                                }
                            }
                        }
                    });
                } else if (type == 'radio') {
                    var price = that.attr('data-price');
                    for (var i in fields) {
                        if (name == i) {
                            if (typeof (fields[i]) == 'object') {
                                var options = fields[i];
                                for (var j in options) {
                                    if (value.value == options[j]) {
                                        if (undefined !== price && '' !== price) {
                                            total_price += parseFloat(price);
                                            // console.log(total_price);
                                        }
                                    }
                                }
                            } else {
                                if (value.value == fields[i]) {
                                    if (undefined !== price && '' !== price) {
                                        total_price += parseFloat(price);
                                        // console.log(total_price);
                                    }
                                }
                            }
                        }
                    }
                } else if (type == 'checkbox') {
                    var price = that.attr('data-price');
                    for (var i in fields) {
                        if (name == i + '[]') {
                            if (typeof (fields[i]) == 'object') {
                                var options = fields[i];
                                for (var j in options) {
                                    if (value.value == options[j]) {
                                        if (undefined !== price && '' !== price) {
                                            total_price += parseFloat(price);
                                            // console.log(total_price);
                                        }
                                    }
                                }
                            } else {
                                if (value.value == fields[i]) {
                                    if (undefined !== price && '' !== price) {
                                        total_price += parseFloat(price);
                                        // console.log(total_price);
                                    }
                                }
                            }
                        } else {
                            if (value.value == fields[i]) {
                                if (undefined !== price && '' !== price) {
                                    total_price += parseFloat(price);
                                    // console.log(total_price);
                                }
                            }
                        }
                    }
                } else if (type == 'file') {
                    var price = that.attr('data-price');
                    var file = that.prop('files');
                    var files = get_files_in_ofb();
                    if (file[0]) {
                        for (var i in files) {
                            if (name == i) {
                                if (undefined !== price && '' !== price) {
                                    total_price += parseFloat(price);
                                    // console.log(total_price);
                                }
                            }
                        }
                    }
                } else {
                    var price = that.attr('data-price');
                    var value = that.val();
                    if (value.length > 0) {
                        for (var i in fields) {
                            if (name == i) {
                                if (undefined !== price && '' !== price) {
                                    total_price += parseFloat(price);
                                    // console.log(total_price);
                                }
                            }
                        }
                    }
                }

            });
            return total_price;
        }

  });

})(jQuery);
// source --> https://www.urbaniki.com/wp-content/plugins/visual-product-configurator-multiple-views-addon/public/js/jquery.bxslider.js?ver=2.9 
/**
 * bxSlider v4.2.5
 * Copyright 2013-2015 Steven Wanderski
 * Written while drinking Belgian ales and listening to jazz
 
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

;
(function ($) {

    var defaults = {
        // GENERAL
        mode: 'horizontal',
        slideSelector: '',
        infiniteLoop: true,
        hideControlOnEnd: false,
        speed: 500,
        easing: null,
        slideMargin: 0,
        startSlide: 0,
        randomStart: false,
        captions: false,
        ticker: false,
        tickerHover: false,
        adaptiveHeight: false,
        adaptiveHeightSpeed: 500,
        video: false,
        useCSS: true,
        preloadImages: 'visible',
        responsive: true,
        slideZIndex: 50,
        wrapperClass: 'bx-wrapper',
        // TOUCH
        touchEnabled: true,
        swipeThreshold: 50,
        oneToOneTouch: true,
        preventDefaultSwipeX: true,
        preventDefaultSwipeY: false,
        // ACCESSIBILITY
        ariaLive: true,
        ariaHidden: true,
        // KEYBOARD
        keyboardEnabled: false,
        // PAGER
        pager: true,
        pagerType: 'full',
        pagerShortSeparator: ' / ',
        pagerSelector: null,
        buildPager: null,
        pagerCustom: null,
        // CONTROLS
        controls: true,
        nextText: 'Next',
        prevText: 'Prev',
        nextSelector: null,
        prevSelector: null,
        autoControls: false,
        startText: 'Start',
        stopText: 'Stop',
        autoControlsCombine: false,
        autoControlsSelector: null,
        // AUTO
        auto: false,
        pause: 4000,
        autoStart: true,
        autoDirection: 'next',
        stopAutoOnClick: false,
        autoHover: false,
        autoDelay: 0,
        autoSlideForOnePage: false,
        // CAROUSEL
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 0,
        slideWidth: 0,
        shrinkItems: false,
        // CALLBACKS
        onSliderLoad: function () {
            return true;
        },
        onSlideBefore: function () {
            return true;
        },
        onSlideAfter: function () {
            return true;
        },
        onSlideNext: function () {
            return true;
        },
        onSlidePrev: function () {
            return true;
        },
        onSliderResize: function () {
            return true;
        }
    };

    $.fn.bxSlider = function (options) {

        if (this.length === 0) {
            return this;
        }

        // support multiple elements
        if (this.length > 1) {
            this.each(function () {
                $(this).bxSlider(options);
            });
            return this;
        }

        // create a namespace to be used throughout the plugin
        var slider = {},
                // set a reference to our slider element
                el = this,
                // get the original window dimens (thanks a lot IE)
                windowWidth = $(window).width(),
                windowHeight = $(window).height();

        // Return if slider is already initialized
        if ($(el).data('bxSlider')) {
            return;
        }

        /**
         * ===================================================================================
         * = PRIVATE FUNCTIONS
         * ===================================================================================
         */

        /**
         * Initializes namespace settings to be used throughout plugin
         */
        var init = function () {
            // Return if slider is already initialized
            if ($(el).data('bxSlider')) {
                return;
            }
            // merge user-supplied options with the defaults
            slider.settings = $.extend({}, defaults, options);
            // parse slideWidth setting
            slider.settings.slideWidth = parseInt(slider.settings.slideWidth);
            // store the original children
            slider.children = el.children(slider.settings.slideSelector);
            // check if actual number of slides is less than minSlides / maxSlides
            if (slider.children.length < slider.settings.minSlides) {
                slider.settings.minSlides = slider.children.length;
            }
            if (slider.children.length < slider.settings.maxSlides) {
                slider.settings.maxSlides = slider.children.length;
            }
            // if random start, set the startSlide setting to random number
            if (slider.settings.randomStart) {
                slider.settings.startSlide = Math.floor(Math.random() * slider.children.length);
            }
            // store active slide information
            slider.active = {index: slider.settings.startSlide};
            // store if the slider is in carousel mode (displaying / moving multiple slides)
            slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1 ? true : false;
            // if carousel, force preloadImages = 'all'
            if (slider.carousel) {
                slider.settings.preloadImages = 'all';
            }
            // calculate the min / max width thresholds based on min / max number of slides
            // used to setup and update carousel slides dimensions
            slider.minThreshold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
            slider.maxThreshold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
            // store the current state of the slider (if currently animating, working is true)
            slider.working = false;
            // initialize the controls object
            slider.controls = {};
            // initialize an auto interval
            slider.interval = null;
            // determine which property to use for transitions
            slider.animProp = slider.settings.mode === 'vertical' ? 'top' : 'left';
            // determine if hardware acceleration can be used
            slider.usingCSS = slider.settings.useCSS && slider.settings.mode !== 'fade' && (function () {
                // create our test div element
                var div = document.createElement('div'),
                        // css transition properties
                        props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
                // test for each property
                for (var i = 0; i < props.length; i++) {
                    if (div.style[props[i]] !== undefined) {
                        slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
                        slider.animProp = '-' + slider.cssPrefix + '-transform';
                        return true;
                    }
                }
                return false;
            }());
            // if vertical mode always make maxSlides and minSlides equal
            if (slider.settings.mode === 'vertical') {
                slider.settings.maxSlides = slider.settings.minSlides;
            }
            // save original style data
            el.data('origStyle', el.attr('style'));
            el.children(slider.settings.slideSelector).each(function () {
                $(this).data('origStyle', $(this).attr('style'));
            });

            // perform all DOM / CSS modifications
            setup();
        };

        /**
         * Performs all DOM and CSS modifications
         */
        var setup = function () {
            var preloadSelector = slider.children.eq(slider.settings.startSlide); // set the default preload selector (visible)

            // wrap el in a wrapper
            el.wrap('<div class="' + slider.settings.wrapperClass + '"><div class="bx-viewport"></div></div>');
            // store a namespace reference to .bx-viewport
            slider.viewport = el.parent();

            // add aria-live if the setting is enabled and ticker mode is disabled
            if (slider.settings.ariaLive && !slider.settings.ticker) {
                slider.viewport.attr('aria-live', 'polite');
            }
            // add a loading div to display while images are loading
            slider.loader = $('<div class="bx-loading" />');
            slider.viewport.prepend(slider.loader);
            // set el to a massive width, to hold any needed slides
            // also strip any margin and padding from el
            el.css({
                width: slider.settings.mode === 'horizontal' ? (slider.children.length * 1000 + 215) + '%' : 'auto',
                position: 'relative'
            });
            // if using CSS, add the easing property
            if (slider.usingCSS && slider.settings.easing) {
                el.css('-' + slider.cssPrefix + '-transition-timing-function', slider.settings.easing);
                // if not using CSS and no easing value was supplied, use the default JS animation easing (swing)
            } else if (!slider.settings.easing) {
                slider.settings.easing = 'swing';
            }
            // make modifications to the viewport (.bx-viewport)
            slider.viewport.css({
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            });
            slider.viewport.parent().css({
                maxWidth: getViewportMaxWidth()
            });
            // make modification to the wrapper (.bx-wrapper)
            if (!slider.settings.pager && !slider.settings.controls) {
                slider.viewport.parent().css({
                    margin: '0 auto 0px'
                });
            }
            // apply css to all slider children
            slider.children.css({
                float: slider.settings.mode === 'horizontal' ? 'left' : 'none',
                listStyle: 'none',
                position: 'relative'
            });
            // apply the calculated width after the float is applied to prevent scrollbar interference
            slider.children.css('width', getSlideWidth());
            // if slideMargin is supplied, add the css
            if (slider.settings.mode === 'horizontal' && slider.settings.slideMargin > 0) {
                slider.children.css('marginRight', slider.settings.slideMargin);
            }
            if (slider.settings.mode === 'vertical' && slider.settings.slideMargin > 0) {
                slider.children.css('marginBottom', slider.settings.slideMargin);
            }
            // if "fade" mode, add positioning and z-index CSS
            if (slider.settings.mode === 'fade') {
                slider.children.css({
                    position: 'absolute',
                    zIndex: 0,
                    display: 'none'
                });
                // prepare the z-index on the showing element
                slider.children.eq(slider.settings.startSlide).css({zIndex: slider.settings.slideZIndex, display: 'block'});
            }
            // create an element to contain all slider controls (pager, start / stop, etc)
            slider.controls.el = $('<div class="bx-controls" />');
            // if captions are requested, add them
            if (slider.settings.captions) {
                appendCaptions();
            }
            // check if startSlide is last slide
            slider.active.last = slider.settings.startSlide === getPagerQty() - 1;
            // if video is true, set up the fitVids plugin
            if (slider.settings.video) {
                el.fitVids();
            }
            if (slider.settings.preloadImages === 'all' || slider.settings.ticker) {
                preloadSelector = slider.children;
            }
            // only check for control addition if not in "ticker" mode
            if (!slider.settings.ticker) {
                // if controls are requested, add them
                if (slider.settings.controls) {
                    appendControls();
                }
                // if auto is true, and auto controls are requested, add them
                if (slider.settings.auto && slider.settings.autoControls) {
                    appendControlsAuto();
                }
                // if pager is requested, add it
                if (slider.settings.pager) {
                    appendPager();
                }
                // if any control option is requested, add the controls wrapper
                if (slider.settings.controls || slider.settings.autoControls || slider.settings.pager) {
                    slider.viewport.after(slider.controls.el);
                }
                // if ticker mode, do not allow a pager
            } else {
                slider.settings.pager = false;
            }
            loadElements(preloadSelector, start);
        };

        var loadElements = function (selector, callback) {
            var total = selector.find('img:not([src=""]), iframe').length,
                    count = 0;
            if (total === 0) {
                callback();
                return;
            }
            selector.find('img:not([src=""]), iframe').each(function () {
                $(this).one('load error', function () {
                    if (++count === total) {
                        callback();
                    }
                }).each(function () {
                    if (this.complete) {
                        $(this).load();
                    }
                });
            });
        };

        /**
         * Start the slider
         */
        var start = function () {
            // if infinite loop, prepare additional slides
            if (slider.settings.infiniteLoop && slider.settings.mode !== 'fade' && !slider.settings.ticker) {
                var slice = slider.settings.mode === 'vertical' ? slider.settings.minSlides : slider.settings.maxSlides,
                        sliceAppend = slider.children.slice(0, slice).clone(true).addClass('bx-clone'),
                        slicePrepend = slider.children.slice(-slice).clone(true).addClass('bx-clone');
                if (slider.settings.ariaHidden) {
                    sliceAppend.attr('aria-hidden', true);
                    slicePrepend.attr('aria-hidden', true);
                }
                el.append(sliceAppend).prepend(slicePrepend);
            }
            // remove the loading DOM element
            slider.loader.remove();
            // set the left / top position of "el"
            setSlidePosition();
            // if "vertical" mode, always use adaptiveHeight to prevent odd behavior
            if (slider.settings.mode === 'vertical') {
                slider.settings.adaptiveHeight = true;
            }
            // set the viewport height
            slider.viewport.height(getViewportHeight());
            // make sure everything is positioned just right (same as a window resize)
            el.redrawSlider();
            // onSliderLoad callback
            slider.settings.onSliderLoad.call(el, slider.active.index);
            // slider has been fully initialized
            slider.initialized = true;
            // bind the resize call to the window
            if (slider.settings.responsive) {
                $(window).bind('resize', resizeWindow);
            }
            // if auto is true and has more than 1 page, start the show
            if (slider.settings.auto && slider.settings.autoStart && (getPagerQty() > 1 || slider.settings.autoSlideForOnePage)) {
                initAuto();
            }
            // if ticker is true, start the ticker
            if (slider.settings.ticker) {
                initTicker();
            }
            // if pager is requested, make the appropriate pager link active
            if (slider.settings.pager) {
                updatePagerActive(slider.settings.startSlide);
            }
            // check for any updates to the controls (like hideControlOnEnd updates)
            if (slider.settings.controls) {
                updateDirectionControls();
            }
            // if touchEnabled is true, setup the touch events
            if (slider.settings.touchEnabled && !slider.settings.ticker) {
                initTouch();
            }
            // if keyboardEnabled is true, setup the keyboard events
            if (slider.settings.keyboardEnabled && !slider.settings.ticker) {
                $(document).keydown(keyPress);
            }
        };

        /**
         * Returns the calculated height of the viewport, used to determine either adaptiveHeight or the maxHeight value
         */
        var getViewportHeight = function () {
            var height = 0;
            // first determine which children (slides) should be used in our height calculation
            var children = $();
            // if mode is not "vertical" and adaptiveHeight is false, include all children
            if (slider.settings.mode !== 'vertical' && !slider.settings.adaptiveHeight) {
                children = slider.children;
            } else {
                // if not carousel, return the single active child
                if (!slider.carousel) {
                    children = slider.children.eq(slider.active.index);
                    // if carousel, return a slice of children
                } else {
                    // get the individual slide index
                    var currentIndex = slider.settings.moveSlides === 1 ? slider.active.index : slider.active.index * getMoveBy();
                    // add the current slide to the children
                    children = slider.children.eq(currentIndex);
                    // cycle through the remaining "showing" slides
                    for (i = 1; i <= slider.settings.maxSlides - 1; i++) {
                        // if looped back to the start
                        if (currentIndex + i >= slider.children.length) {
                            children = children.add(slider.children.eq(i - 1));
                        } else {
                            children = children.add(slider.children.eq(currentIndex + i));
                        }
                    }
                }
            }
            // if "vertical" mode, calculate the sum of the heights of the children
            if (slider.settings.mode === 'vertical') {
                children.each(function (index) {
                    height += $(this).outerHeight();
                });
                // add user-supplied margins
                if (slider.settings.slideMargin > 0) {
                    height += slider.settings.slideMargin * (slider.settings.minSlides - 1);
                }
                // if not "vertical" mode, calculate the max height of the children
            } else {
                height = Math.max.apply(Math, children.map(function () {
                    return $(this).outerHeight(false);
                }).get());
            }

            if (slider.viewport.css('box-sizing') === 'border-box') {
                height += parseFloat(slider.viewport.css('padding-top')) + parseFloat(slider.viewport.css('padding-bottom')) +
                        parseFloat(slider.viewport.css('border-top-width')) + parseFloat(slider.viewport.css('border-bottom-width'));
            } else if (slider.viewport.css('box-sizing') === 'padding-box') {
                height += parseFloat(slider.viewport.css('padding-top')) + parseFloat(slider.viewport.css('padding-bottom'));
            }

            return height;
        };

        /**
         * Returns the calculated width to be used for the outer wrapper / viewport
         */
        var getViewportMaxWidth = function () {
            var width = '100%';
            if (slider.settings.slideWidth > 0) {
                if (slider.settings.mode === 'horizontal') {
                    width = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
                } else {
                    width = slider.settings.slideWidth;
                }
            }
            return width;
        };

        /**
         * Returns the calculated width to be applied to each slide
         */
        var getSlideWidth = function () {
            var newElWidth = slider.settings.slideWidth, // start with any user-supplied slide width
                    wrapWidth = slider.viewport.width();    // get the current viewport width
            // if slide width was not supplied, or is larger than the viewport use the viewport width
            if (slider.settings.slideWidth === 0 ||
                    (slider.settings.slideWidth > wrapWidth && !slider.carousel) ||
                    slider.settings.mode === 'vertical') {
                newElWidth = wrapWidth;
                // if carousel, use the thresholds to determine the width
            } else if (slider.settings.maxSlides > 1 && slider.settings.mode === 'horizontal') {
                if (wrapWidth > slider.maxThreshold) {
                    return newElWidth;
                } else if (wrapWidth < slider.minThreshold) {
                    newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
                } else if (slider.settings.shrinkItems) {
                    newElWidth = Math.floor((wrapWidth + slider.settings.slideMargin) / (Math.ceil((wrapWidth + slider.settings.slideMargin) / (newElWidth + slider.settings.slideMargin))) - slider.settings.slideMargin);
                }
            }
            return newElWidth;
        };

        /**
         * Returns the number of slides currently visible in the viewport (includes partially visible slides)
         */
        var getNumberSlidesShowing = function () {
            var slidesShowing = 1,
                    childWidth = null;
            if (slider.settings.mode === 'horizontal' && slider.settings.slideWidth > 0) {
                // if viewport is smaller than minThreshold, return minSlides
                if (slider.viewport.width() < slider.minThreshold) {
                    slidesShowing = slider.settings.minSlides;
                    // if viewport is larger than maxThreshold, return maxSlides
                } else if (slider.viewport.width() > slider.maxThreshold) {
                    slidesShowing = slider.settings.maxSlides;
                    // if viewport is between min / max thresholds, divide viewport width by first child width
                } else {
                    childWidth = slider.children.first().width() + slider.settings.slideMargin;
                    slidesShowing = Math.floor((slider.viewport.width() +
                            slider.settings.slideMargin) / childWidth);
                }
                // if "vertical" mode, slides showing will always be minSlides
            } else if (slider.settings.mode === 'vertical') {
                slidesShowing = slider.settings.minSlides;
            }
            return slidesShowing;
        };

        /**
         * Returns the number of pages (one full viewport of slides is one "page")
         */
        var getPagerQty = function () {
            var pagerQty = 0,
                    breakPoint = 0,
                    counter = 0;
            // if moveSlides is specified by the user
            if (slider.settings.moveSlides > 0) {
                if (slider.settings.infiniteLoop) {
                    pagerQty = Math.ceil(slider.children.length / getMoveBy());
                } else {
                    // when breakpoint goes above children length, counter is the number of pages
                    while (breakPoint < slider.children.length) {
                        ++pagerQty;
                        breakPoint = counter + getNumberSlidesShowing();
                        counter += slider.settings.moveSlides <= getNumberSlidesShowing() ? slider.settings.moveSlides : getNumberSlidesShowing();
                    }
                }
                // if moveSlides is 0 (auto) divide children length by sides showing, then round up
            } else {
                pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
            }
            return pagerQty;
        };

        /**
         * Returns the number of individual slides by which to shift the slider
         */
        var getMoveBy = function () {
            // if moveSlides was set by the user and moveSlides is less than number of slides showing
            if (slider.settings.moveSlides > 0 && slider.settings.moveSlides <= getNumberSlidesShowing()) {
                return slider.settings.moveSlides;
            }
            // if moveSlides is 0 (auto)
            return getNumberSlidesShowing();
        };

        /**
         * Sets the slider's (el) left or top position
         */
        var setSlidePosition = function () {
            var position, lastChild, lastShowingIndex;
            // if last slide, not infinite loop, and number of children is larger than specified maxSlides
            if (slider.children.length > slider.settings.maxSlides && slider.active.last && !slider.settings.infiniteLoop) {
                if (slider.settings.mode === 'horizontal') {
                    // get the last child's position
                    lastChild = slider.children.last();
                    position = lastChild.position();
                    // set the left position
                    setPositionProperty(-(position.left - (slider.viewport.width() - lastChild.outerWidth())), 'reset', 0);
                } else if (slider.settings.mode === 'vertical') {
                    // get the last showing index's position
                    lastShowingIndex = slider.children.length - slider.settings.minSlides;
                    position = slider.children.eq(lastShowingIndex).position();
                    // set the top position
                    setPositionProperty(-position.top, 'reset', 0);
                }
                // if not last slide
            } else {
                // get the position of the first showing slide
                position = slider.children.eq(slider.active.index * getMoveBy()).position();
                // check for last slide
                if (slider.active.index === getPagerQty() - 1) {
                    slider.active.last = true;
                }
                // set the respective position
                if (position !== undefined) {
                    if (slider.settings.mode === 'horizontal') {
                        setPositionProperty(-position.left, 'reset', 0);
                    } else if (slider.settings.mode === 'vertical') {
                        setPositionProperty(-position.top, 'reset', 0);
                    }
                }
            }
        };

        /**
         * Sets the el's animating property position (which in turn will sometimes animate el).
         * If using CSS, sets the transform property. If not using CSS, sets the top / left property.
         *
         * @param value (int)
         *  - the animating property's value
         *
         * @param type (string) 'slide', 'reset', 'ticker'
         *  - the type of instance for which the function is being
         *
         * @param duration (int)
         *  - the amount of time (in ms) the transition should occupy
         *
         * @param params (array) optional
         *  - an optional parameter containing any variables that need to be passed in
         */
        var setPositionProperty = function (value, type, duration, params) {
            var animateObj, propValue;
            // use CSS transform
            if (slider.usingCSS) {
                // determine the translate3d value
                propValue = slider.settings.mode === 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
                // add the CSS transition-duration
                el.css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
                if (type === 'slide') {
                    // set the property value
                    el.css(slider.animProp, propValue);
                    if (duration !== 0) {
                        // bind a callback method - executes when CSS transition completes
                        el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function (e) {
                            //make sure it's the correct one
                            if (!$(e.target).is(el)) {
                                return;
                            }
                            // unbind the callback
                            el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                            updateAfterSlideTransition();
                        });
                    } else { //duration = 0
                        updateAfterSlideTransition();
                    }
                } else if (type === 'reset') {
                    el.css(slider.animProp, propValue);
                } else if (type === 'ticker') {
                    // make the transition use 'linear'
                    el.css('-' + slider.cssPrefix + '-transition-timing-function', 'linear');
                    el.css(slider.animProp, propValue);
                    if (duration !== 0) {
                        el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function (e) {
                            //make sure it's the correct one
                            if (!$(e.target).is(el)) {
                                return;
                            }
                            // unbind the callback
                            el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                            // reset the position
                            setPositionProperty(params.resetValue, 'reset', 0);
                            // start the loop again
                            tickerLoop();
                        });
                    } else { //duration = 0
                        setPositionProperty(params.resetValue, 'reset', 0);
                        tickerLoop();
                    }
                }
                // use JS animate
            } else {
                animateObj = {};
                animateObj[slider.animProp] = value;
                if (type === 'slide') {
                    el.animate(animateObj, duration, slider.settings.easing, function () {
                        updateAfterSlideTransition();
                    });
                } else if (type === 'reset') {
                    el.css(slider.animProp, value);
                } else if (type === 'ticker') {
                    el.animate(animateObj, duration, 'linear', function () {
                        setPositionProperty(params.resetValue, 'reset', 0);
                        // run the recursive loop after animation
                        tickerLoop();
                    });
                }
            }
        };

        /**
         * Populates the pager with proper amount of pages
         */
        var populatePager = function () {
            var pagerHtml = '',
                    linkContent = '',
                    pagerQty = getPagerQty();
            // loop through each pager item
            for (var i = 0; i < pagerQty; i++) {
                linkContent = '';
                // if a buildPager function is supplied, use it to get pager link value, else use index + 1
                if (slider.settings.buildPager && $.isFunction(slider.settings.buildPager) || slider.settings.pagerCustom) {
                    linkContent = slider.settings.buildPager(i);
                    slider.pagerEl.addClass('bx-custom-pager');
                } else {
                    linkContent = i + 1;
                    slider.pagerEl.addClass('bx-default-pager');
                }
                // var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i) : i + 1;
                // add the markup to the string
                pagerHtml += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a></div>';
            }
            // populate the pager element with pager links
            slider.pagerEl.html(pagerHtml);
        };

        /**
         * Appends the pager to the controls element
         */
        var appendPager = function () {
            if (!slider.settings.pagerCustom) {
                // create the pager DOM element
                slider.pagerEl = $('<div class="bx-pager" />');
                // if a pager selector was supplied, populate it with the pager
                if (slider.settings.pagerSelector) {
                    $(slider.settings.pagerSelector).html(slider.pagerEl);
                    // if no pager selector was supplied, add it after the wrapper
                } else {
                    slider.controls.el.addClass('bx-has-pager').append(slider.pagerEl);
                }
                // populate the pager
                populatePager();
            } else {
                slider.pagerEl = $(slider.settings.pagerCustom);
            }
            // assign the pager click binding
            slider.pagerEl.on('click touchend', 'a', clickPagerBind);
        };

        /**
         * Appends prev / next controls to the controls element
         */
        var appendControls = function () {
            slider.controls.next = $('<a class="bx-next" href="">></a>');
            slider.controls.prev = $('<a class="bx-prev" href=""><</a>');
            // bind click actions to the controls
            slider.controls.next.bind('click touchend', clickNextBind);
            slider.controls.prev.bind('click touchend', clickPrevBind);
            // if nextSelector was supplied, populate it
            if (slider.settings.nextSelector) {
                $(slider.settings.nextSelector).append(slider.controls.next);
            }
            // if prevSelector was supplied, populate it
            if (slider.settings.prevSelector) {
                $(slider.settings.prevSelector).append(slider.controls.prev);
            }
            // if no custom selectors were supplied
            if (!slider.settings.nextSelector && !slider.settings.prevSelector) {
                // add the controls to the DOM
                slider.controls.directionEl = $('<div class="bx-controls-direction" />');
                // add the control elements to the directionEl
                slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
                // slider.viewport.append(slider.controls.directionEl);
                slider.controls.el.addClass('bx-has-controls-direction').append(slider.controls.directionEl);
            }
        };

        /**
         * Appends start / stop auto controls to the controls element
         */
        var appendControlsAuto = function () {
            slider.controls.start = $('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + slider.settings.startText + '</a></div>');
            slider.controls.stop = $('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + slider.settings.stopText + '</a></div>');
            // add the controls to the DOM
            slider.controls.autoEl = $('<div class="bx-controls-auto" />');
            // bind click actions to the controls
            slider.controls.autoEl.on('click', '.bx-start', clickStartBind);
            slider.controls.autoEl.on('click', '.bx-stop', clickStopBind);
            // if autoControlsCombine, insert only the "start" control
            if (slider.settings.autoControlsCombine) {
                slider.controls.autoEl.append(slider.controls.start);
                // if autoControlsCombine is false, insert both controls
            } else {
                slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
            }
            // if auto controls selector was supplied, populate it with the controls
            if (slider.settings.autoControlsSelector) {
                $(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
                // if auto controls selector was not supplied, add it after the wrapper
            } else {
                slider.controls.el.addClass('bx-has-controls-auto').append(slider.controls.autoEl);
            }
            // update the auto controls
            updateAutoControls(slider.settings.autoStart ? 'stop' : 'start');
        };

        /**
         * Appends image captions to the DOM
         */
        var appendCaptions = function () {
            // cycle through each child
            slider.children.each(function (index) {
                // get the image title attribute
                var title = $(this).find('img:first').attr('title');
                // append the caption
                if (title !== undefined && ('' + title).length) {
                    $(this).append('<div class="bx-caption"><span>' + title + '</span></div>');
                }
            });
        };

        /**
         * Click next binding
         *
         * @param e (event)
         *  - DOM event object
         */
        var clickNextBind = function (e) {
            e.preventDefault();
            if (slider.controls.el.hasClass('disabled')) {
                return;
            }
            // if auto show is running, stop it
            if (slider.settings.auto && slider.settings.stopAutoOnClick) {
                el.stopAuto();
            }
            el.goToNextSlide();
        };

        /**
         * Click prev binding
         *
         * @param e (event)
         *  - DOM event object
         */
        var clickPrevBind = function (e) {
            e.preventDefault();
            if (slider.controls.el.hasClass('disabled')) {
                return;
            }
            // if auto show is running, stop it
            if (slider.settings.auto && slider.settings.stopAutoOnClick) {
                el.stopAuto();
            }
            el.goToPrevSlide();
        };

        /**
         * Click start binding
         *
         * @param e (event)
         *  - DOM event object
         */
        var clickStartBind = function (e) {
            el.startAuto();
            e.preventDefault();
        };

        /**
         * Click stop binding
         *
         * @param e (event)
         *  - DOM event object
         */
        var clickStopBind = function (e) {
            el.stopAuto();
            e.preventDefault();
        };

        /**
         * Click pager binding
         *
         * @param e (event)
         *  - DOM event object
         */
        var clickPagerBind = function (e) {
            var pagerLink, pagerIndex;
            e.preventDefault();
            if (slider.controls.el.hasClass('disabled')) {
                return;
            }
            // if auto show is running, stop it
            if (slider.settings.auto && slider.settings.stopAutoOnClick) {
                el.stopAuto();
            }
            pagerLink = $(e.currentTarget);
            if (pagerLink.attr('data-slide-index') !== undefined) {
                pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
                // if clicked pager link is not active, continue with the goToSlide call
                if (pagerIndex !== slider.active.index) {
                    el.goToSlide(pagerIndex);
                }
            }
        };

        /**
         * Updates the pager links with an active class
         *
         * @param slideIndex (int)
         *  - index of slide to make active
         */
        var updatePagerActive = function (slideIndex) {
            // if "short" pager type
            var len = slider.children.length; // nb of children
            if (slider.settings.pagerType === 'short') {
                if (slider.settings.maxSlides > 1) {
                    len = Math.ceil(slider.children.length / slider.settings.maxSlides);
                }
                slider.pagerEl.html((slideIndex + 1) + slider.settings.pagerShortSeparator + len);
                return;
            }
            // remove all pager active classes
            slider.pagerEl.find('a').removeClass('active');
            // apply the active class for all pagers
            slider.pagerEl.each(function (i, el) {
                $(el).find('a').eq(slideIndex).addClass('active');
            });
        };

        /**
         * Performs needed actions after a slide transition
         */
        var updateAfterSlideTransition = function () {
            // if infinite loop is true
            if (slider.settings.infiniteLoop) {
                var position = '';
                // first slide
                if (slider.active.index === 0) {
                    // set the new position
                    position = slider.children.eq(0).position();
                    // carousel, last slide
                } else if (slider.active.index === getPagerQty() - 1 && slider.carousel) {
                    position = slider.children.eq((getPagerQty() - 1) * getMoveBy()).position();
                    // last slide
                } else if (slider.active.index === slider.children.length - 1) {
                    position = slider.children.eq(slider.children.length - 1).position();
                }
                if (position) {
                    if (slider.settings.mode === 'horizontal') {
                        setPositionProperty(-position.left, 'reset', 0);
                    } else if (slider.settings.mode === 'vertical') {
                        setPositionProperty(-position.top, 'reset', 0);
                    }
                }
            }
            // declare that the transition is complete
            slider.working = false;
            // onSlideAfter callback
            slider.settings.onSlideAfter.call(el, slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
        };

        /**
         * Updates the auto controls state (either active, or combined switch)
         *
         * @param state (string) "start", "stop"
         *  - the new state of the auto show
         */
        var updateAutoControls = function (state) {
            // if autoControlsCombine is true, replace the current control with the new state
            if (slider.settings.autoControlsCombine) {
                slider.controls.autoEl.html(slider.controls[state]);
                // if autoControlsCombine is false, apply the "active" class to the appropriate control
            } else {
                slider.controls.autoEl.find('a').removeClass('active');
                slider.controls.autoEl.find('a:not(.bx-' + state + ')').addClass('active');
            }
        };

        /**
         * Updates the direction controls (checks if either should be hidden)
         */
        var updateDirectionControls = function () {
            if (getPagerQty() === 1) {
                slider.controls.prev.addClass('disabled');
                slider.controls.next.addClass('disabled');
            } else if (!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd) {
                // if first slide
                if (slider.active.index === 0) {
                    slider.controls.prev.addClass('disabled');
                    slider.controls.next.removeClass('disabled');
                    // if last slide
                } else if (slider.active.index === getPagerQty() - 1) {
                    slider.controls.next.addClass('disabled');
                    slider.controls.prev.removeClass('disabled');
                    // if any slide in the middle
                } else {
                    slider.controls.prev.removeClass('disabled');
                    slider.controls.next.removeClass('disabled');
                }
            }
        };

        /**
         * Initializes the auto process
         */
        var initAuto = function () {
            // if autoDelay was supplied, launch the auto show using a setTimeout() call
            if (slider.settings.autoDelay > 0) {
                var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
                // if autoDelay was not supplied, start the auto show normally
            } else {
                el.startAuto();

                //add focus and blur events to ensure its running if timeout gets paused
                $(window).focus(function () {
                    el.startAuto();
                }).blur(function () {
                    el.stopAuto();
                });
            }
            // if autoHover is requested
            if (slider.settings.autoHover) {
                // on el hover
                el.hover(function () {
                    // if the auto show is currently playing (has an active interval)
                    if (slider.interval) {
                        // stop the auto show and pass true argument which will prevent control update
                        el.stopAuto(true);
                        // create a new autoPaused value which will be used by the relative "mouseout" event
                        slider.autoPaused = true;
                    }
                }, function () {
                    // if the autoPaused value was created be the prior "mouseover" event
                    if (slider.autoPaused) {
                        // start the auto show and pass true argument which will prevent control update
                        el.startAuto(true);
                        // reset the autoPaused value
                        slider.autoPaused = null;
                    }
                });
            }
        };

        /**
         * Initializes the ticker process
         */
        var initTicker = function () {
            var startPosition = 0,
                    position, transform, value, idx, ratio, property, newSpeed, totalDimens;
            // if autoDirection is "next", append a clone of the entire slider
            if (slider.settings.autoDirection === 'next') {
                el.append(slider.children.clone().addClass('bx-clone'));
                // if autoDirection is "prev", prepend a clone of the entire slider, and set the left position
            } else {
                el.prepend(slider.children.clone().addClass('bx-clone'));
                position = slider.children.first().position();
                startPosition = slider.settings.mode === 'horizontal' ? -position.left : -position.top;
            }
            setPositionProperty(startPosition, 'reset', 0);
            // do not allow controls in ticker mode
            slider.settings.pager = false;
            slider.settings.controls = false;
            slider.settings.autoControls = false;
            // if autoHover is requested
            if (slider.settings.tickerHover) {
                if (slider.usingCSS) {
                    idx = slider.settings.mode === 'horizontal' ? 4 : 5;
                    slider.viewport.hover(function () {
                        transform = el.css('-' + slider.cssPrefix + '-transform');
                        value = parseFloat(transform.split(',')[idx]);
                        setPositionProperty(value, 'reset', 0);
                    }, function () {
                        totalDimens = 0;
                        slider.children.each(function (index) {
                            totalDimens += slider.settings.mode === 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
                        });
                        // calculate the speed ratio (used to determine the new speed to finish the paused animation)
                        ratio = slider.settings.speed / totalDimens;
                        // determine which property to use
                        property = slider.settings.mode === 'horizontal' ? 'left' : 'top';
                        // calculate the new speed
                        newSpeed = ratio * (totalDimens - (Math.abs(parseInt(value))));
                        tickerLoop(newSpeed);
                    });
                } else {
                    // on el hover
                    slider.viewport.hover(function () {
                        el.stop();
                    }, function () {
                        // calculate the total width of children (used to calculate the speed ratio)
                        totalDimens = 0;
                        slider.children.each(function (index) {
                            totalDimens += slider.settings.mode === 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
                        });
                        // calculate the speed ratio (used to determine the new speed to finish the paused animation)
                        ratio = slider.settings.speed / totalDimens;
                        // determine which property to use
                        property = slider.settings.mode === 'horizontal' ? 'left' : 'top';
                        // calculate the new speed
                        newSpeed = ratio * (totalDimens - (Math.abs(parseInt(el.css(property)))));
                        tickerLoop(newSpeed);
                    });
                }
            }
            // start the ticker loop
            tickerLoop();
        };

        /**
         * Runs a continuous loop, news ticker-style
         */
        var tickerLoop = function (resumeSpeed) {
            var speed = resumeSpeed ? resumeSpeed : slider.settings.speed,
                    position = {left: 0, top: 0},
            reset = {left: 0, top: 0},
            animateProperty, resetValue, params;

            // if "next" animate left position to last child, then reset left to 0
            if (slider.settings.autoDirection === 'next') {
                position = el.find('.bx-clone').first().position();
                // if "prev" animate left position to 0, then reset left to first non-clone child
            } else {
                reset = slider.children.first().position();
            }
            animateProperty = slider.settings.mode === 'horizontal' ? -position.left : -position.top;
            resetValue = slider.settings.mode === 'horizontal' ? -reset.left : -reset.top;
            params = {resetValue: resetValue};
            setPositionProperty(animateProperty, 'ticker', speed, params);
        };

        /**
         * Check if el is on screen
         */
        var isOnScreen = function (el) {
            var win = $(window),
                    viewport = {
                        top: win.scrollTop(),
                        left: win.scrollLeft()
                    },
            bounds = el.offset();

            viewport.right = viewport.left + win.width();
            viewport.bottom = viewport.top + win.height();
            bounds.right = bounds.left + el.outerWidth();
            bounds.bottom = bounds.top + el.outerHeight();

            return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
        };

        /**
         * Initializes keyboard events
         */
        var keyPress = function (e) {
            var activeElementTag = document.activeElement.tagName.toLowerCase(),
                    tagFilters = 'input|textarea',
                    p = new RegExp(activeElementTag, ['i']),
                    result = p.exec(tagFilters);

            if (result == null && isOnScreen(el)) {
                if (e.keyCode === 39) {
                    clickNextBind(e);
                    return false;
                } else if (e.keyCode === 37) {
                    clickPrevBind(e);
                    return false;
                }
            }
        };

        /**
         * Initializes touch events
         */
        var initTouch = function () {
            // initialize object to contain all touch values
            slider.touch = {
                start: {x: 0, y: 0},
                end: {x: 0, y: 0}
            };
            slider.viewport.bind('touchstart MSPointerDown pointerdown', onTouchStart);

            //for browsers that have implemented pointer events and fire a click after
            //every pointerup regardless of whether pointerup is on same screen location as pointerdown or not
            slider.viewport.on('click', '.bxslider a', function (e) {
                if (slider.viewport.hasClass('click-disabled')) {
                    e.preventDefault();
                    slider.viewport.removeClass('click-disabled');
                }
            });
        };

        /**
         * Event handler for "touchstart"
         *
         * @param e (event)
         *  - DOM event object
         */
        var onTouchStart = function (e) {
            //disable slider controls while user is interacting with slides to avoid slider freeze that happens on touch devices when a slide swipe happens immediately after interacting with slider controls
            slider.controls.el.addClass('disabled');

            if (slider.working) {
                e.preventDefault();
                slider.controls.el.removeClass('disabled');
            } else {
                // record the original position when touch starts
                slider.touch.originalPos = el.position();
                var orig = e.originalEvent,
                        touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig];
                // record the starting touch x, y coordinates
                slider.touch.start.x = touchPoints[0].pageX;
                slider.touch.start.y = touchPoints[0].pageY;

                if (slider.viewport.get(0).setPointerCapture) {
                    slider.pointerId = orig.pointerId;
                    slider.viewport.get(0).setPointerCapture(slider.pointerId);
                }
                // bind a "touchmove" event to the viewport
                slider.viewport.bind('touchmove MSPointerMove pointermove', onTouchMove);
                // bind a "touchend" event to the viewport
                slider.viewport.bind('touchend MSPointerUp pointerup', onTouchEnd);
                slider.viewport.bind('MSPointerCancel pointercancel', onPointerCancel);
            }
        };

        /**
         * Cancel Pointer for Windows Phone
         *
         * @param e (event)
         *  - DOM event object
         */
        var onPointerCancel = function (e) {
            /* onPointerCancel handler is needed to deal with situations when a touchend
             doesn't fire after a touchstart (this happens on windows phones only) */
            setPositionProperty(slider.touch.originalPos.left, 'reset', 0);

            //remove handlers
            slider.controls.el.removeClass('disabled');
            slider.viewport.unbind('MSPointerCancel pointercancel', onPointerCancel);
            slider.viewport.unbind('touchmove MSPointerMove pointermove', onTouchMove);
            slider.viewport.unbind('touchend MSPointerUp pointerup', onTouchEnd);
            if (slider.viewport.get(0).releasePointerCapture) {
                slider.viewport.get(0).releasePointerCapture(slider.pointerId);
            }
        };

        /**
         * Event handler for "touchmove"
         *
         * @param e (event)
         *  - DOM event object
         */
        var onTouchMove = function (e) {
            var orig = e.originalEvent,
                    touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig],
                    // if scrolling on y axis, do not prevent default
                    xMovement = Math.abs(touchPoints[0].pageX - slider.touch.start.x),
                    yMovement = Math.abs(touchPoints[0].pageY - slider.touch.start.y),
                    value = 0,
                    change = 0;

            // x axis swipe
            if ((xMovement * 3) > yMovement && slider.settings.preventDefaultSwipeX) {
                e.preventDefault();
                // y axis swipe
            } else if ((yMovement * 3) > xMovement && slider.settings.preventDefaultSwipeY) {
                e.preventDefault();
            }
            if (slider.settings.mode !== 'fade' && slider.settings.oneToOneTouch) {
                // if horizontal, drag along x axis
                if (slider.settings.mode === 'horizontal') {
                    change = touchPoints[0].pageX - slider.touch.start.x;
                    value = slider.touch.originalPos.left + change;
                    // if vertical, drag along y axis
                } else {
                    change = touchPoints[0].pageY - slider.touch.start.y;
                    value = slider.touch.originalPos.top + change;
                }
                setPositionProperty(value, 'reset', 0);
            }
        };

        /**
         * Event handler for "touchend"
         *
         * @param e (event)
         *  - DOM event object
         */
        var onTouchEnd = function (e) {
            slider.viewport.unbind('touchmove MSPointerMove pointermove', onTouchMove);
            //enable slider controls as soon as user stops interacing with slides
            slider.controls.el.removeClass('disabled');
            var orig = e.originalEvent,
                    touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig],
                    value = 0,
                    distance = 0;
            // record end x, y positions
            slider.touch.end.x = touchPoints[0].pageX;
            slider.touch.end.y = touchPoints[0].pageY;
            // if fade mode, check if absolute x distance clears the threshold
            if (slider.settings.mode === 'fade') {
                distance = Math.abs(slider.touch.start.x - slider.touch.end.x);
                if (distance >= slider.settings.swipeThreshold) {
                    if (slider.touch.start.x > slider.touch.end.x) {
                        el.goToNextSlide();
                    } else {
                        el.goToPrevSlide();
                    }
                    el.stopAuto();
                }
                // not fade mode
            } else {
                // calculate distance and el's animate property
                if (slider.settings.mode === 'horizontal') {
                    distance = slider.touch.end.x - slider.touch.start.x;
                    value = slider.touch.originalPos.left;
                } else {
                    distance = slider.touch.end.y - slider.touch.start.y;
                    value = slider.touch.originalPos.top;
                }
                // if not infinite loop and first / last slide, do not attempt a slide transition
                if (!slider.settings.infiniteLoop && ((slider.active.index === 0 && distance > 0) || (slider.active.last && distance < 0))) {
                    setPositionProperty(value, 'reset', 200);
                } else {
                    // check if distance clears threshold
                    if (Math.abs(distance) >= slider.settings.swipeThreshold) {
                        if (distance < 0) {
                            el.goToNextSlide();
                        } else {
                            el.goToPrevSlide();
                        }
                        el.stopAuto();
                    } else {
                        // el.animate(property, 200);
                        setPositionProperty(value, 'reset', 200);
                    }
                }
            }
            slider.viewport.unbind('touchend MSPointerUp pointerup', onTouchEnd);
            if (slider.viewport.get(0).releasePointerCapture) {
                slider.viewport.get(0).releasePointerCapture(slider.pointerId);
            }
        };

        /**
         * Window resize event callback
         */
        var resizeWindow = function (e) {
            // don't do anything if slider isn't initialized.
            if (!slider.initialized) {
                return;
            }
            // Delay if slider working.
            if (slider.working) {
                window.setTimeout(resizeWindow, 10);
            } else {
                // get the new window dimens (again, thank you IE)
                var windowWidthNew = $(window).width(),
                        windowHeightNew = $(window).height();
                // make sure that it is a true window resize
                // *we must check this because our dinosaur friend IE fires a window resize event when certain DOM elements
                // are resized. Can you just die already?*
                if (windowWidth !== windowWidthNew || windowHeight !== windowHeightNew) {
                    // set the new window dimens
                    windowWidth = windowWidthNew;
                    windowHeight = windowHeightNew;
                    // update all dynamic elements
                    el.redrawSlider();
                    // Call user resize handler
                    slider.settings.onSliderResize.call(el, slider.active.index);
                }
            }
        };

        /**
         * Adds an aria-hidden=true attribute to each element
         *
         * @param startVisibleIndex (int)
         *  - the first visible element's index
         */
        var applyAriaHiddenAttributes = function (startVisibleIndex) {
            var numberOfSlidesShowing = getNumberSlidesShowing();
            // only apply attributes if the setting is enabled and not in ticker mode
            if (slider.settings.ariaHidden && !slider.settings.ticker) {
                // add aria-hidden=true to all elements
                slider.children.attr('aria-hidden', 'true');
                // get the visible elements and change to aria-hidden=false
                slider.children.slice(startVisibleIndex, startVisibleIndex + numberOfSlidesShowing).attr('aria-hidden', 'false');
            }
        };

        /**
         * Returns index according to present page range
         *
         * @param slideOndex (int)
         *  - the desired slide index
         */
        var setSlideIndex = function (slideIndex) {
            if (slideIndex < 0) {
                if (slider.settings.infiniteLoop) {
                    return getPagerQty() - 1;
                } else {
                    //we don't go to undefined slides
                    return slider.active.index;
                }
                // if slideIndex is greater than children length, set active index to 0 (this happens during infinite loop)
            } else if (slideIndex >= getPagerQty()) {
                if (slider.settings.infiniteLoop) {
                    return 0;
                } else {
                    //we don't move to undefined pages
                    return slider.active.index;
                }
                // set active index to requested slide
            } else {
                return slideIndex;
            }
        };

        /**
         * ===================================================================================
         * = PUBLIC FUNCTIONS
         * ===================================================================================
         */

        /**
         * Performs slide transition to the specified slide
         *
         * @param slideIndex (int)
         *  - the destination slide's index (zero-based)
         *
         * @param direction (string)
         *  - INTERNAL USE ONLY - the direction of travel ("prev" / "next")
         */
        el.goToSlide = function (slideIndex, direction) {
            // onSlideBefore, onSlideNext, onSlidePrev callbacks
            // Allow transition canceling based on returned value
            var performTransition = true,
                    moveBy = 0,
                    position = {left: 0, top: 0},
            lastChild = null,
                    lastShowingIndex, eq, value, requestEl;
            // store the old index
            slider.oldIndex = slider.active.index;
            //set new index
            slider.active.index = setSlideIndex(slideIndex);

            // if plugin is currently in motion, ignore request
            if (slider.working || slider.active.index === slider.oldIndex) {
                return;
            }
            // declare that plugin is in motion
            slider.working = true;

            performTransition = slider.settings.onSlideBefore.call(el, slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);

            // If transitions canceled, reset and return
            if (typeof (performTransition) !== 'undefined' && !performTransition) {
                slider.active.index = slider.oldIndex; // restore old index
                slider.working = false; // is not in motion
                return;
            }

            if (direction === 'next') {
                // Prevent canceling in future functions or lack there-of from negating previous commands to cancel
                if (!slider.settings.onSlideNext.call(el, slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index)) {
                    performTransition = false;
                }
            } else if (direction === 'prev') {
                // Prevent canceling in future functions or lack there-of from negating previous commands to cancel
                if (!slider.settings.onSlidePrev.call(el, slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index)) {
                    performTransition = false;
                }
            }

            // check if last slide
            slider.active.last = slider.active.index >= getPagerQty() - 1;
            // update the pager with active class
            if (slider.settings.pager || slider.settings.pagerCustom) {
                updatePagerActive(slider.active.index);
            }
            // // check for direction control update
            if (slider.settings.controls) {
                updateDirectionControls();
            }
            // if slider is set to mode: "fade"
            if (slider.settings.mode === 'fade') {
                // if adaptiveHeight is true and next height is different from current height, animate to the new height
                if (slider.settings.adaptiveHeight && slider.viewport.height() !== getViewportHeight()) {
                    slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
                }
                // fade out the visible child and reset its z-index value
                slider.children.filter(':visible').fadeOut(slider.settings.speed).css({zIndex: 0});
                // fade in the newly requested slide
                slider.children.eq(slider.active.index).css('zIndex', slider.settings.slideZIndex + 1).fadeIn(slider.settings.speed, function () {
                    $(this).css('zIndex', slider.settings.slideZIndex);
                    updateAfterSlideTransition();
                });
                // slider mode is not "fade"
            } else {
                // if adaptiveHeight is true and next height is different from current height, animate to the new height
                if (slider.settings.adaptiveHeight && slider.viewport.height() !== getViewportHeight()) {
                    slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
                }
                // if carousel and not infinite loop
                if (!slider.settings.infiniteLoop && slider.carousel && slider.active.last) {
                    if (slider.settings.mode === 'horizontal') {
                        // get the last child position
                        lastChild = slider.children.eq(slider.children.length - 1);
                        position = lastChild.position();
                        // calculate the position of the last slide
                        moveBy = slider.viewport.width() - lastChild.outerWidth();
                    } else {
                        // get last showing index position
                        lastShowingIndex = slider.children.length - slider.settings.minSlides;
                        position = slider.children.eq(lastShowingIndex).position();
                    }
                    // horizontal carousel, going previous while on first slide (infiniteLoop mode)
                } else if (slider.carousel && slider.active.last && direction === 'prev') {
                    // get the last child position
                    eq = slider.settings.moveSlides === 1 ? slider.settings.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (slider.children.length - slider.settings.maxSlides);
                    lastChild = el.children('.bx-clone').eq(eq);
                    position = lastChild.position();
                    // if infinite loop and "Next" is clicked on the last slide
                } else if (direction === 'next' && slider.active.index === 0) {
                    // get the last clone position
                    position = el.find('> .bx-clone').eq(slider.settings.maxSlides).position();
                    slider.active.last = false;
                    // normal non-zero requests
                } else if (slideIndex >= 0) {
                    //parseInt is applied to allow floats for slides/page
                    requestEl = slideIndex * parseInt(getMoveBy());
                    position = slider.children.eq(requestEl).position();
                }

                /* If the position doesn't exist
                 * (e.g. if you destroy the slider on a next click),
                 * it doesn't throw an error.
                 */
                if (typeof (position) !== 'undefined') {
                    value = slider.settings.mode === 'horizontal' ? -(position.left - moveBy) : -position.top;
                    // plugin values to be animated
                    setPositionProperty(value, 'slide', slider.settings.speed);
                } else {
                    slider.working = false;
                }
            }
            if (slider.settings.ariaHidden) {
                applyAriaHiddenAttributes(slider.active.index * getMoveBy());
            }
        };

        /**
         * Transitions to the next slide in the show
         */
        el.goToNextSlide = function () {
            // if infiniteLoop is false and last page is showing, disregard call
            if (!slider.settings.infiniteLoop && slider.active.last) {
                return;
            }
            var pagerIndex = parseInt(slider.active.index) + 1;
            el.goToSlide(pagerIndex, 'next');
        };

        /**
         * Transitions to the prev slide in the show
         */
        el.goToPrevSlide = function () {
            // if infiniteLoop is false and last page is showing, disregard call
            if (!slider.settings.infiniteLoop && slider.active.index === 0) {
                return;
            }
            var pagerIndex = parseInt(slider.active.index) - 1;
            el.goToSlide(pagerIndex, 'prev');
        };

        /**
         * Starts the auto show
         *
         * @param preventControlUpdate (boolean)
         *  - if true, auto controls state will not be updated
         */
        el.startAuto = function (preventControlUpdate) {
            // if an interval already exists, disregard call
            if (slider.interval) {
                return;
            }
            // create an interval
            slider.interval = setInterval(function () {
                if (slider.settings.autoDirection === 'next') {
                    el.goToNextSlide();
                } else {
                    el.goToPrevSlide();
                }
            }, slider.settings.pause);
            // if auto controls are displayed and preventControlUpdate is not true
            if (slider.settings.autoControls && preventControlUpdate !== true) {
                updateAutoControls('stop');
            }
        };

        /**
         * Stops the auto show
         *
         * @param preventControlUpdate (boolean)
         *  - if true, auto controls state will not be updated
         */
        el.stopAuto = function (preventControlUpdate) {
            // if no interval exists, disregard call
            if (!slider.interval) {
                return;
            }
            // clear the interval
            clearInterval(slider.interval);
            slider.interval = null;
            // if auto controls are displayed and preventControlUpdate is not true
            if (slider.settings.autoControls && preventControlUpdate !== true) {
                updateAutoControls('start');
            }
        };

        /**
         * Returns current slide index (zero-based)
         */
        el.getCurrentSlide = function () {
            return slider.active.index;
        };

        /**
         * Returns current slide element
         */
        el.getCurrentSlideElement = function () {
            return slider.children.eq(slider.active.index);
        };

        /**
         * Returns a slide element
         * @param index (int)
         *  - The index (zero-based) of the element you want returned.
         */
        el.getSlideElement = function (index) {
            return slider.children.eq(index);
        };

        /**
         * Returns number of slides in show
         */
        el.getSlideCount = function () {
            return slider.children.length;
        };

        /**
         * Return slider.working variable
         */
        el.isWorking = function () {
            return slider.working;
        };

        /**
         * Update all dynamic slider elements
         */
        el.redrawSlider = function () {
            // resize all children in ratio to new screen size
            slider.children.add(el.find('.bx-clone')).outerWidth(getSlideWidth());
            // adjust the height
            slider.viewport.css('height', getViewportHeight());
            // update the slide position
            if (!slider.settings.ticker) {
                setSlidePosition();
            }
            // if active.last was true before the screen resize, we want
            // to keep it last no matter what screen size we end on
            if (slider.active.last) {
                slider.active.index = getPagerQty() - 1;
            }
            // if the active index (page) no longer exists due to the resize, simply set the index as last
            if (slider.active.index >= getPagerQty()) {
                slider.active.last = true;
            }
            // if a pager is being displayed and a custom pager is not being used, update it
            if (slider.settings.pager && !slider.settings.pagerCustom) {
                populatePager();
                updatePagerActive(slider.active.index);
            }
            if (slider.settings.ariaHidden) {
                applyAriaHiddenAttributes(slider.active.index * getMoveBy());
            }
        };

        /**
         * Destroy the current instance of the slider (revert everything back to original state)
         */
        el.destroySlider = function () {
            // don't do anything if slider has already been destroyed
            if (!slider.initialized) {
                return;
            }
            slider.initialized = false;
            $('.bx-clone', this).remove();
            slider.children.each(function () {
                if ($(this).data('origStyle') !== undefined) {
                    $(this).attr('style', $(this).data('origStyle'));
                } else {
                    $(this).removeAttr('style');
                }
            });
            if ($(this).data('origStyle') !== undefined) {
                this.attr('style', $(this).data('origStyle'));
            } else {
                $(this).removeAttr('style');
            }
            $(this).unwrap().unwrap();
            if (slider.controls.el) {
                slider.controls.el.remove();
            }
            if (slider.controls.next) {
                slider.controls.next.remove();
            }
            if (slider.controls.prev) {
                slider.controls.prev.remove();
            }
            if (slider.pagerEl && slider.settings.controls && !slider.settings.pagerCustom) {
                slider.pagerEl.remove();
            }
            $('.bx-caption', this).remove();
            if (slider.controls.autoEl) {
                slider.controls.autoEl.remove();
            }
            clearInterval(slider.interval);
            if (slider.settings.responsive) {
                $(window).unbind('resize', resizeWindow);
            }
            if (slider.settings.keyboardEnabled) {
                $(document).unbind('keydown', keyPress);
            }
            //remove self reference in data
            $(this).removeData('bxSlider');
        };

        /**
         * Reload the slider (revert all DOM changes, and re-initialize)
         */
        el.reloadSlider = function (settings) {
            if (settings !== undefined) {
                options = settings;
            }
            el.destroySlider();
            init();
            //store reference to self in order to access public functions later
            $(el).data('bxSlider', this);
        };

        init();

        $(el).data('bxSlider', this);

        // returns the current jQuery object
        return this;
    };

})(jQuery);
// source --> https://www.urbaniki.com/wp-content/plugins/duracelltomi-google-tag-manager/js/gtm4wp-woocommerce-enhanced.js?ver=1.11.6 
var gtm4wp_last_selected_product_variation;
var gtm4wp_changedetail_fired_during_pageload=false;

function gtm4wp_handle_cart_qty_change() {
	jQuery( '.product-quantity input.qty' ).each(function() {
		var _original_value = jQuery( this ).prop( 'defaultValue' );

		var _current_value  = parseInt( jQuery( this ).val() );
		if ( Number.isNaN( _current_value ) ) {
			_current_value = _original_value;
		}

		if ( _original_value != _current_value ) {
			var productdata = jQuery( this ).closest( '.cart_item' ).find( '.remove' );
			var productprice = productdata.data( 'gtm4wp_product_price' );

			if ( typeof productprice == "string" ) {
				productprice = parseFloat( productprice );
				if ( isNaN( productprice ) ) {
					productprice = 0;
				}
			} else if ( typeof productprice != "number" ) {
				productprice = 0;
			}

			if ( _original_value < _current_value ) {
				window[ gtm4wp_datalayer_name ].push({
					'event': 'gtm4wp.addProductToCartEEC',
					'ecommerce': {
						'currencyCode': gtm4wp_currency,
						'add': {
							'products': [{
								'name':       productdata.data( 'gtm4wp_product_name' ),
								'id':         productdata.data( 'gtm4wp_product_id' ),
								'price':      productprice.toFixed(2),
								'category':   productdata.data( 'gtm4wp_product_cat' ),
								'variant':    productdata.data( 'gtm4wp_product_variant' ),
								'stocklevel': productdata.data( 'gtm4wp_product_stocklevel' ),
								'brand':      productdata.data( 'gtm4wp_product_brand' ),
								'quantity':   _current_value - _original_value
							}]
						}
					}
				});
			} else {
				window[ gtm4wp_datalayer_name ].push({
					'event': 'gtm4wp.removeFromCartEEC',
					'ecommerce': {
						'currencyCode': gtm4wp_currency,
						'remove': {
							'products': [{
								'name':       productdata.data( 'gtm4wp_product_name' ),
								'id':         productdata.data( 'gtm4wp_product_id' ),
								'price':      productprice.toFixed(2),
								'category':   productdata.data( 'gtm4wp_product_cat' ),
								'variant':    productdata.data( 'gtm4wp_product_variant' ),
								'stocklevel': productdata.data( 'gtm4wp_product_stocklevel' ),
								'brand':      productdata.data( 'gtm4wp_product_brand' ),
								'quantity':   _original_value - _current_value
							}]
						}
					}
				});
			}
		} // end if qty changed
	}); // end each qty field
} // end gtm4wp_handle_cart_qty_change()

jQuery(function() {
	var is_cart     = jQuery( 'body' ).hasClass( 'woocommerce-cart' );
	var is_checkout = jQuery( 'body' ).hasClass( 'woocommerce-checkout' );

	// track impressions of products in product lists
	if ( jQuery( '.gtm4wp_productdata,.widget-product-item' ).length > 0 ) {
		var products = [];
		var productdata, productprice=0;
		jQuery( '.gtm4wp_productdata,.widget-product-item' ).each( function() {
			productdata = jQuery( this );
			productprice = productdata.data( 'gtm4wp_product_price' );

			if ( typeof productprice == "string" ) {
				productprice = parseFloat( productprice );
				if ( isNaN( productprice ) ) {
					productprice = 0;
				}
			} else if ( typeof productprice != "number" ) {
				productprice = 0;
			}

			products.push({
				'name':       productdata.data( 'gtm4wp_product_name' ),
				'id':         productdata.data( 'gtm4wp_product_id' ),
				'price':      productprice.toFixed(2),
				'category':   productdata.data( 'gtm4wp_product_cat' ),
				'position':   productdata.data( 'gtm4wp_product_listposition' ),
				'list':       productdata.data( 'gtm4wp_productlist_name' ),
				'stocklevel': productdata.data( 'gtm4wp_product_stocklevel' ),
				'brand':      productdata.data( 'gtm4wp_product_brand' )
			});

		});

		if ( gtm4wp_product_per_impression > 0 ) {
			// Need to split the product submissions up into chunks in order to avoid the GA 8kb submission limit
			var chunk;
			while ( products.length ) {
				chunk = products.splice( 0, gtm4wp_product_per_impression );

				window[ gtm4wp_datalayer_name ].push({
					'event': 'gtm4wp.productImpressionEEC',
					'ecommerce': {
						'currencyCode': gtm4wp_currency,
						'impressions': chunk
					}
				});
			}
		} else {
			for( var i=0; i<window[ gtm4wp_datalayer_name ].length; i++ ) {
				if ( window[ gtm4wp_datalayer_name ][ i ][ 'ecommerce' ] ) {

					if ( ! window[ gtm4wp_datalayer_name ][ i ][ 'ecommerce' ][ 'impressions' ] ) {
						window[ gtm4wp_datalayer_name ][ i ][ 'ecommerce' ][ 'impressions' ] = products;
					} else {
						window[ gtm4wp_datalayer_name ][ i ][ 'ecommerce' ][ 'impressions' ] = window[ gtm4wp_datalayer_name ][ i ][ 'ecommerce' ][ 'impressions' ].concat( products );
					}

					break;
				}
			}

			if ( i == window[ gtm4wp_datalayer_name ].length ) {
				// no existing ecommerce data found in the datalayer
				i = 0;
				window[ gtm4wp_datalayer_name ][ i ][ 'ecommerce' ] = {};
				window[ gtm4wp_datalayer_name ][ i ][ 'ecommerce' ][ 'impressions' ] = products;
			}

			window[ gtm4wp_datalayer_name ][ i ][ 'ecommerce' ][ 'currencyCode' ] = gtm4wp_currency;

		}
	}

	// track add to cart events for simple products in product lists
	jQuery( document ).on( 'click', '.add_to_cart_button:not(.product_type_variable, .product_type_grouped, .single_add_to_cart_button)', function() {
		var productdata = jQuery( this ).closest( '.product' ).find( '.gtm4wp_productdata' );
		var productprice = productdata.data( 'gtm4wp_product_price' );

		if ( typeof productprice == "string" ) {
			productprice = parseFloat( productprice );
			if ( isNaN( productprice ) ) {
				productprice = 0;
			}
		} else if ( typeof productprice != "number" ) {
			productprice = 0;
		}

		window[ gtm4wp_datalayer_name ].push({
			'event': 'gtm4wp.addProductToCartEEC',
			'ecommerce': {
				'currencyCode': gtm4wp_currency,
				'add': {
					'products': [{
						'name':       productdata.data( 'gtm4wp_product_name' ),
						'id':         productdata.data( 'gtm4wp_product_id' ),
						'price':      productprice.toFixed(2),
						'category':   productdata.data( 'gtm4wp_product_cat' ),
						'stocklevel': productdata.data( 'gtm4wp_product_stocklevel' ),
						'brand':      productdata.data( 'gtm4wp_product_brand' ),
						'quantity':   1
					}]
				}
			}
		});
	});

	// track add to cart events for products on product detail pages
	jQuery( document ).on( 'click', '.single_add_to_cart_button:not(.disabled)', function() {
		var _product_form       = jQuery( this ).closest( 'form.cart' );
		var _product_var_id     = jQuery( '[name=variation_id]', _product_form );
		var _product_is_grouped = jQuery( _product_form ).hasClass( 'grouped_form' );

		if ( _product_var_id.length > 0 ) {
			if ( gtm4wp_last_selected_product_variation ) {
				gtm4wp_last_selected_product_variation.quantity = jQuery( 'form.cart:first input[name=quantity]' ).val();

				window[ gtm4wp_datalayer_name ].push({
					'event': 'gtm4wp.addProductToCartEEC',
					'ecommerce': {
						'currencyCode': gtm4wp_currency,
						'add': {
							'products': [gtm4wp_last_selected_product_variation]
						}
					}
				});
			}
		} else if ( _product_is_grouped ) {
			var _products_in_group = jQuery( '.grouped_form .gtm4wp_productdata' );
			var _products_eec = [];

			_products_in_group.each( function() {
				var productdata = jQuery( this );

				var product_qty_input = jQuery( 'input[name=quantity\\[' + productdata.data( 'gtm4wp_product_id' ) + '\\]]' );
				if ( product_qty_input.length > 0 ) {
					product_qty = product_qty_input.val();
				} else {
					return;
				}

				if ( 0 == product_qty ) {
					return;
				}

				_products_eec.push({
					'id':         gtm4wp_use_sku_instead ? productdata.data( 'gtm4wp_product_sku' ) : productdata.data( 'gtm4wp_product_id' ),
					'name':       productdata.data( 'gtm4wp_product_name' ),
					'price':      productdata.data( 'gtm4wp_product_price' ),
					'category':   productdata.data( 'gtm4wp_product_cat' ),
					'quantity':   product_qty,
					'stocklevel': productdata.data( 'gtm4wp_product_stocklevel' ),
					'brand':      productdata.data( 'gtm4wp_product_brand' )
				});
			});

			if ( 0 == _products_eec.length ) {
				return;
			}

			window[ gtm4wp_datalayer_name ].push({
				'event': 'gtm4wp.addProductToCartEEC',
				'ecommerce': {
					'currencyCode': gtm4wp_currency,
					'add': {
						'products': _products_eec
					}
				}
			});
		} else {
			window[ gtm4wp_datalayer_name ].push({
				'event': 'gtm4wp.addProductToCartEEC',
				'ecommerce': {
					'currencyCode': gtm4wp_currency,
					'add': {
						'products': [{
							'id':         gtm4wp_use_sku_instead ? jQuery( '[name=gtm4wp_sku]', _product_form ).val() : jQuery( '[name=gtm4wp_id]', _product_form ).val(),
							'name':       jQuery( '[name=gtm4wp_name]', _product_form ).val(),
							'price':      jQuery( '[name=gtm4wp_price]', _product_form ).val(),
							'category':   jQuery( '[name=gtm4wp_category]', _product_form ).val(),
							'quantity':   jQuery( 'form.cart:first input[name=quantity]' ).val(),
							'stocklevel': jQuery( '[name=gtm4wp_stocklevel]', _product_form ).val(),
							'brand':      jQuery( '[name=gtm4wp_brand]', _product_form ).val()
						}]
					}
				}
			});
		}
	});

	// track remove links in mini cart widget and on cart page
	jQuery( document ).on( 'click', '.mini_cart_item a.remove,.product-remove a.remove', function() {
		var productdata = jQuery( this );

		var qty = 0;
		var qty_element = jQuery( this ).closest( '.cart_item' ).find( '.product-quantity input.qty' );
		if ( qty_element.length === 0 ) {
			qty_element = jQuery( this ).closest( '.mini_cart_item' ).find( '.quantity' );
			if ( qty_element.length > 0 ) {
				qty = parseInt( qty_element.text() );

				if ( Number.isNaN( qty ) ) {
					qty = 0;
				}
			}
		} else {
			qty = qty_element.val();
		}

		if ( qty === 0 ) {
			return true;
		}

		window[ gtm4wp_datalayer_name ].push({
			'event': 'gtm4wp.removeFromCartEEC',
			'ecommerce': {
				'remove': {
					'products': [{
						'name':       productdata.data( 'gtm4wp_product_name' ),
						'id':         productdata.data( 'gtm4wp_product_id' ),
						'price':      productdata.data( 'gtm4wp_product_price' ),
						'category':   productdata.data( 'gtm4wp_product_cat' ),
						'variant':    productdata.data( 'gtm4wp_product_variant' ),
						'stocklevel': productdata.data( 'gtm4wp_product_stocklevel' ),
						'brand':      productdata.data( 'gtm4wp_product_brand' ),
						'quantity':   qty
					}]
				}
			}
		});
	});

	// track clicks in product lists
	jQuery( document ).on( 'click', '.products li:not(.product-category) a:not(.add_to_cart_button):not(.quick-view-button),.products>div:not(.product-category) a:not(.add_to_cart_button):not(.quick-view-button),.widget-product-item,.woocommerce-grouped-product-list-item__label a', function( event ) {
		// do nothing if GTM is blocked for some reason
		if ( 'undefined' == typeof google_tag_manager ) {
			return true;
		}

		var _productdata = jQuery( this ).closest( '.product' );
		var productdata = '';

		if ( _productdata.length > 0 ) {
			productdata = _productdata.find( '.gtm4wp_productdata' );

		} else {
			_productdata = jQuery( this ).closest( '.products li' );

			if ( _productdata.length > 0 ) {
				productdata = _productdata.find( '.gtm4wp_productdata' );

			} else {
				_productdata = jQuery( this ).closest( '.products>div' );

				if ( _productdata.length > 0 ) {
					productdata = _productdata.find( '.gtm4wp_productdata' );

				} else {
					_productdata = jQuery( this ).closest( '.woocommerce-grouped-product-list-item__label' );

					if ( _productdata.length > 0 ) {
						productdata = _productdata.find( '.gtm4wp_productdata' );
					} else {
						productdata = jQuery( this );
					}
				}
			}
		}

		if ( ( 'undefined' == typeof productdata.data( 'gtm4wp_product_id' ) ) || ( '' == productdata.data( 'gtm4wp_product_id' ) ) ) {
			return true;
		}

		// only act on links pointing to the product detail page
		if ( productdata.data( 'gtm4wp_product_url' ) != jQuery( this ).attr( 'href' ) ) {
			return true;
		}

		var ctrl_key_pressed = event.ctrlKey || event.metaKey;

		event.preventDefault();
		if ( ctrl_key_pressed ) {
			// we need to open the new tab/page here so that popup blocker of the browser doesn't block our code
			var _productpage = window.open( 'about:blank', '_blank' );
		}

		window[ gtm4wp_datalayer_name ].push({
			'event': 'gtm4wp.productClickEEC',
			'ecommerce': {
				'currencyCode': gtm4wp_currency,
				'click': {
					'actionField': {'list': productdata.data( 'gtm4wp_productlist_name' )},
					'products': [{
						'id':         productdata.data( 'gtm4wp_product_id' ),
						'name':       productdata.data( 'gtm4wp_product_name' ),
						'price':      productdata.data( 'gtm4wp_product_price' ),
						'category':   productdata.data( 'gtm4wp_product_cat' ),
						'stocklevel': productdata.data( 'gtm4wp_product_stocklevel' ),
						'brand':      productdata.data( 'gtm4wp_product_brand' ),
						'position':   productdata.data( 'gtm4wp_product_listposition' )
					}]
				}
			},
			'eventCallback': function() {
				if ( ctrl_key_pressed && _productpage ) {
					_productpage.location.href= productdata.data( 'gtm4wp_product_url' );
				} else {
					document.location.href = productdata.data( 'gtm4wp_product_url' );
				}
			},
			'eventTimeout': 2000
		});
	});

	// track variable products on their detail pages
	jQuery( document ).on( 'found_variation', function( event, product_variation ) {
		if ( "undefined" == typeof product_variation ) {
			// some ither plugins trigger this event without variation data
			return;
		}

		if ( (document.readyState === "interactive") && gtm4wp_changedetail_fired_during_pageload ) {
			// some custom attribute rendering plugins fire this event multiple times during page load
			return;
		}

		var _product_form       = event.target;
		var _product_var_id     = jQuery( '[name=variation_id]', _product_form );
		var _product_id         = jQuery( '[name=gtm4wp_id]', _product_form ).val();
		var _product_name       = jQuery( '[name=gtm4wp_name]', _product_form ).val();
		var _product_sku        = jQuery( '[name=gtm4wp_sku]', _product_form ).val();
		var _product_category   = jQuery( '[name=gtm4wp_category]', _product_form ).val();
		var _product_price      = jQuery( '[name=gtm4wp_price]', _product_form ).val();
		var _product_stocklevel = jQuery( '[name=gtm4wp_stocklevel]', _product_form ).val();
		var _product_brand      = jQuery( '[name=gtm4wp_brand]', _product_form ).val();

		var current_product_detail_data   = {
			name: _product_name,
			id: 0,
			price: 0,
			category: _product_category,
			stocklevel: _product_stocklevel,
			brand: _product_brand,
			variant: ''
		};

		current_product_detail_data.id = product_variation.variation_id;
		if ( gtm4wp_use_sku_instead && product_variation.sku && ('' !== product_variation.sku) ) {
			current_product_detail_data.id = product_variation.sku;
		}
		current_product_detail_data.price = product_variation.display_price;

		var _tmp = [];
		for( var attrib_key in product_variation.attributes ) {
			_tmp.push( product_variation.attributes[ attrib_key ] );
		}
		current_product_detail_data.variant = _tmp.join(',');
		gtm4wp_last_selected_product_variation = current_product_detail_data;

		window[ gtm4wp_datalayer_name ].push({
			'event': 'gtm4wp.changeDetailViewEEC',
			'ecommerce': {
				'currencyCode': gtm4wp_currency,
				'detail': {
					'products': [current_product_detail_data]
				},
			},
			'ecomm_prodid': gtm4wp_id_prefix + current_product_detail_data.id,
			'ecomm_pagetype': 'product',
			'ecomm_totalvalue': current_product_detail_data.price,
		});

		if ( document.readyState === "interactive" ) {
			gtm4wp_changedetail_fired_during_pageload = true;
		}
	});
	jQuery( '.variations select' ).trigger( 'change' );

	// initiate codes in WooCommere Quick View
	jQuery( document ).ajaxSuccess( function( event, xhr, settings ) {
		if(typeof settings !== 'undefined') {
			if (settings.url.indexOf( 'wc-api=WC_Quick_View' ) > -1 ) {
			  setTimeout( function() {
					jQuery( ".woocommerce.quick-view" ).parent().find( "script" ).each( function(i) {
						eval( jQuery( this ).text() );
					});
				}, 500);
			}
		}
	});

	// codes for enhanced ecommerce events on cart page
	if ( is_cart ) {
		jQuery( document ).on( 'click', '[name=update_cart]', function() {
			gtm4wp_handle_cart_qty_change();
		});

		jQuery( document ).on( 'keypress', '.woocommerce-cart-form input[type=number]', function() {
			gtm4wp_handle_cart_qty_change();
		});
	}

	// codes for enhanced ecommerce events on checkout page
	if ( is_checkout ) {
		window.gtm4wp_checkout_step_offset = window.gtm4wp_checkout_step_offset || 0;
		window.gtm4wp_checkout_products    = window.gtm4wp_checkout_products || [];
		var gtm4wp_shipping_payment_method_step_offset =  window.gtm4wp_needs_shipping_address ? 0 : -1;
		var gtm4wp_checkout_step_fired          = []; // step 1 will be the billing section which is reported during pageload, no need to handle here

		jQuery( document ).on( 'blur', 'input[name^=shipping_]:not(input[name^=shipping_method])', function() {
			// do not report checkout step if already reported
			if ( gtm4wp_checkout_step_fired.indexOf( 'shipping' ) > -1 ) {
				return;
			}

			// do not report checkout step if user is traversing through the section without filling in any data
			if ( jQuery( this ).val().trim() == '' ) {
				return;
			}

			window[ gtm4wp_datalayer_name ].push({
				'event': 'gtm4wp.checkoutStepEEC',
				'ecommerce': {
					'checkout': {
						'actionField': {
							'step': 2 + window.gtm4wp_checkout_step_offset
						},
						'products': window.gtm4wp_checkout_products
					}
				}
			});

			gtm4wp_checkout_step_fired.push( 'shipping' );
		});

		jQuery( document ).on( 'change', 'input[name^=shipping_method]', function() {
			// do not report checkout step if already reported
			if ( gtm4wp_checkout_step_fired.indexOf( 'shipping_method' ) > -1 ) {
				return;
			}

			// do not fire event during page load
			if ( 'complete' != document.readyState ) {
				return;
			}

			window[ gtm4wp_datalayer_name ].push({
				'event': 'gtm4wp.checkoutStepEEC',
				'ecommerce': {
					'checkout': {
						'actionField': {
							'step': 3 + window.gtm4wp_checkout_step_offset + gtm4wp_shipping_payment_method_step_offset
						},
						'products': window.gtm4wp_checkout_products
					}
				}
			});

			gtm4wp_checkout_step_fired.push( 'shipping_method' );
		});

		jQuery( document ).on( 'change', 'input[name=payment_method]', function() {
			// do not report checkout step if already reported
			if ( gtm4wp_checkout_step_fired.indexOf( 'payment_method' ) > -1 ) {
				return;
			}

			// do not fire event during page load
			if ( 'complete' != document.readyState ) {
				return;
			}

			window[ gtm4wp_datalayer_name ].push({
				'event': 'gtm4wp.checkoutStepEEC',
				'ecommerce': {
					'checkout': {
						'actionField': {
							'step': 4 + window.gtm4wp_checkout_step_offset + gtm4wp_shipping_payment_method_step_offset
						},
						'products': window.gtm4wp_checkout_products
					}
				}
			});

			gtm4wp_checkout_step_fired.push( 'payment_method' );
		});

		jQuery( 'form[name=checkout]' ).on( 'submit', function() {
			if ( gtm4wp_checkout_step_fired.indexOf( 'shipping_method' ) == -1 ) {
				// shipping methods are not visible if only one is available
				// and if the user has already a pre-selected method, no click event will fire to report the checkout step
				var selected_shipping_method = jQuery( 'input[name^=shipping_method]:checked' );
				if ( selected_shipping_method.length == 0 ) {
					selected_shipping_method = jQuery( 'input[name^=shipping_method]:first' );
				}
				if ( selected_shipping_method.length > 0 ) {
					selected_shipping_method.trigger( 'change' );
				}
			}

			if ( gtm4wp_checkout_step_fired.indexOf( 'payment_method' ) == -1 ) {
				// if the user has already a pre-selected method, no click event will fire to report the checkout step
				jQuery( 'input[name=payment_method]:checked' ).trigger( 'change' );
			}

			var _shipping_el = jQuery( 'input[name^=shipping_method]:checked' );
			if ( _shipping_el.length == 0 ) {
				_shipping_el = jQuery( 'input[name^=shipping_method]:first' );
			}
			if ( _shipping_el.length > 0 ) {
				window[ gtm4wp_datalayer_name ].push({
					'event': 'gtm4wp.checkoutOptionEEC',
					'ecommerce': {
						'checkout_option': {
							'actionField': {
								'step': 3 + window.gtm4wp_checkout_step_offset + gtm4wp_shipping_payment_method_step_offset,
								'option': 'Shipping: ' + _shipping_el.val()
							}
						}
					}
				});
			}

			var _payment_el = jQuery( '.payment_methods input:checked' );
			if ( _payment_el.length > 0 ) {
				window[ gtm4wp_datalayer_name ].push({
					'event': 'gtm4wp.checkoutOptionEEC',
					'ecommerce': {
						'checkout_option': {
							'actionField': {
								'step': 4 + window.gtm4wp_checkout_step_offset + gtm4wp_shipping_payment_method_step_offset,
								'option': 'Payment: ' + _payment_el.val()
							}
						}
					}
				});
			}
		});
	}

	// codes for Google Ads dynamic remarketing
	if ( window.gtm4wp_remarketing&& !is_cart && !is_checkout ) {
		if ( jQuery( '.gtm4wp_productdata' ).length > 0 ) {
			for( var i=0; i<window[ gtm4wp_datalayer_name ].length; i++ ) {
				if ( window[ gtm4wp_datalayer_name ][ i ][ 'ecomm_prodid' ] ) {
					break;
				}
			}

			if ( i == window[ gtm4wp_datalayer_name ].length ) {
				// no existing dyn remarketing data found in the datalayer
				i = 0;
				window[ gtm4wp_datalayer_name ][ i ][ 'ecomm_prodid' ] = [];
			}

			if ( 'undefined' == typeof window[ gtm4wp_datalayer_name ][ i ][ 'ecomm_prodid' ].push ) {
				return false;
			}

			var productdata;
			jQuery( '.gtm4wp_productdata' ).each( function() {
				productdata = jQuery( this );

				window[ gtm4wp_datalayer_name ][ i ][ 'ecomm_prodid' ].push( gtm4wp_id_prefix + productdata.data( 'gtm4wp_product_id' ) );
			});
		}
	}
});