(function ($) {
    var transparent;
      if (typeof (transparent) == "undefined") {
             var $temp = $('<div style="background:none;display:none;"/>').appendTo('body');
               transparent = $temp.css('backgroundColor');
               $temp.remove();
    }

      $.fn.rippleEffect = function (options) {
               var opts = $.extend({}, $.fn.rippleEffect.defaults, options);

        return this.each(function () {

            $(this).on("click", function (e) {
                var $thisElement = $(this),
                eventPageX,
                eventPageY,
                inkX,
                inkY,
                maxDiameter,
                eventType = e.type,
                rippleColor,
                $inkSpan,
                $inkparent;

                      $inkparent = $thisElement;

                function getRippleColorFromTraverse() {
                    if (opts.inkColor != "") {
                        return opts.inkColor;
                    } else {
                        return getInkColor($inkparent, opts.inkDefaultColor);
                    }
                }
                           if (opts.appendInkTo != "") {
                    $inkparent = $thisElement.closest(opts.appendInkTo);
                }
                            if ($inkparent.find("." + opts.inkClass).length == 0) {
                   
                    $inkparent.append('<span class="' + opts.inkContainerClass + '"><span class="' + opts.inkClass + '"></span></span>');
                }
             
                $inkSpan = $inkparent.find("." + opts.inkContainerClass + " > " + " ." + opts.inkClass);
              
                $inkSpan.removeClass("animate");

          
                if (!$inkSpan.height() && !$inkSpan.width()) {
                    maxDiameter = Math.max($inkparent.outerWidth(), $inkparent.outerHeight());
       
                    if (typeof ($thisElement.data("ripple")) != "undefined" && $thisElement.data("ripple") != "") {
                        rippleColor = $thisElement.data("ripple");
                    } else {
                
                        if (typeof ($thisElement.data("ripple-getcolorfromid")) != "undefined" && $thisElement.data("ripple-getcolorfromid") != "") {
                            var idToUse = $thisElement.data("ripple-getcolorfromid");
                       
                            if ($(idToUse).length > 0) {
                       
                                rippleColor = $(idToUse).css("background-color");
                            } else {
                         
                                rippleColor = getRippleColorFromTraverse();
                            }
                        } else {
                     
                            rippleColor = getRippleColorFromTraverse();
                        }
                    }
                 
                    $inkSpan.css({ height: maxDiameter, width: maxDiameter, "background-color": rippleColor });
                }
              
                if(eventType === "click"){
                    eventPageX = e.pageX; 
                    eventPageY = e.pageY;
                } else if(eventType === "touchstart") {
                    var touch = (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]);
                    eventPageX = touch.pageX;
                    eventPageY = touch.pageY
                }
               
                inkX = (eventPageX - $inkparent.offset().left - $inkSpan.width() / 2);
                inkY = (eventPageY - $inkparent.offset().top - $inkSpan.height() / 2);
                $inkSpan.css({ top: inkY + 'px', left: inkX + 'px' }).addClass("animate");
              
                setTimeout(function () {
                    $inkSpan.removeClass("animate")
                }, 800);

            });
        });
    };
   
    $.fn.rippleEffect.defaults = {
        inkContainerClass: "ripple",
        inkClass: "ink",
        inkDefaultColor: "#F0F0F0", 
               appendInkTo: ""
    };

    function getBackgroundColorForInk($element, fallback) {
        function getBgColor($elementToCheckForBg) {
            if ($elementToCheckForBg.css('backgroundColor') == transparent) {
               
                return !$elementToCheckForBg.is('body') ? getBgColor($elementToCheckForBg.parent()) : fallback || transparent;
            } else {
         
                return $elementToCheckForBg.css('backgroundColor');
            }
        }
        
        return getBgColor($element);
    };

    $.fn.rippleEffect.getLuminationValue = function (hexcolor) {
        var hexcolor = hexcolor.substring(1);      
        var rgb = parseInt(hexcolor, 16);
        var r = (rgb >> 16) & 0xff;  
        var g = (rgb >> 8) & 0xff; 
        var b = (rgb >> 0) & 0xff; 

        var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma;
    }

    $.fn.rippleEffect.getColorLuminance = function (hexcolor, lum) {
      
        hexcolor = String(hexcolor).replace(/[^0-9a-f]/gi, '');
        if (hexcolor.length < 6) {
            hexcolor = hexcolor[0] + hexcolor[0] + hexcolor[1] + hexcolor[1] + hexcolor[2] + hexcolor[2];
        }
   
        lum = lum || 0;

      
        var resultHex = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hexcolor.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            resultHex += ("00" + c).substr(c.length);
        }

        return resultHex;
    }

    $.fn.rippleEffect.colorToHex = function (rgb) {
        if (rgb.substr(0, 1) === '#') {
            return color;
        }
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
         ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }

    function getInkColor($element, fallBackColor) {
        var backgroundOrInhreitedBackGround,
            hex,
            luma,
            returnLumintion;

        backgroundOrInhreitedBackGround = getBackgroundColorForInk($element, fallBackColor);
        hex = $.fn.rippleEffect.colorToHex(backgroundOrInhreitedBackGround);
        luma = $.fn.rippleEffect.getLuminationValue(hex);
        if (luma <= 239) {
            if (luma <= 70) {
                returnLumintion = $.fn.rippleEffect.getColorLuminance(hex, 0.80);
            } else {
                returnLumintion = $.fn.rippleEffect.getColorLuminance(hex, 0.20);
            }
        } else {
            returnLumintion = $.fn.rippleEffect.getColorLuminance(hex, -0.15);
        }
        return returnLumintion;
    };
	
    $("[data-ripple]").rippleEffect();
})(jQuery);


