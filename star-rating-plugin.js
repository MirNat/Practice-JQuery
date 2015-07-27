(function ($) {
    'use strict';
    var methods = {
        init: function (params) {
                var MinNumberOfRatingElements = 1;
                var MinScore = 0;
                this.self = $(this);
                this.options = $.extend({}, $.fn.rating.defaults, params);//merge user params with default options 

                if (this.options.number < MinNumberOfRatingElements) {
                    this.options.number = MinNumberOfRatingElements;
                    handleException('Incorrect "number" parameter, must be >= 1.');
                }

                if (this.options.score < MinScore) {
                    this.options.number = MinScore;
                    handleException('Incorrect "score" parameter, must be >= 0.');
                }

                if (typeof this.options.readonly !== 'boolean') {
                    this.options.readonly = $.fn.rating.defaults.readonly;
                    handleException('Incorrect "readonly" parameter, must be boolean.');
                }

                if (typeof this.options.icon !== 'string') {
                    this.options.icon = $.fn.rating.defaults.icon;
                    handleException('Incorrect "icon" parameter, must be string. Besides it`s name must be one of icons name on http://fortawesome.github.io/Font-Awesome/icons/');
                }

                if (!isHexadecimalNumber(this.options.normalColor)) {
                    this.options.normalColor = $.fn.rating.defaults.normalColor;
                    handleException('Incorrect "normalColor" parameter, must be hexadecimal number started with "#".');
                }

                if (!isHexadecimalNumber(this.options.ratedColor)) {
                    this.options.ratedColor = $.fn.rating.defaults.ratedColor;
                    handleException('Incorrect "ratedColor" parameter, must be hexadecimal number started with "#".');
                }

                if (parseInt(this.options.size, 10) != 'number') {
                    this.options.size = $.fn.rating.defaults.size;
                    handleException('Incorrect "size" parameter, must be a number ended with css unit of measure (px,pt,em).');
                }

                var parentId = this.self.attr('id');

                createRatingElementsWithOptions(this.self, this.options);

                if (typeof this.options.mouseover === 'function') {
                    $('#' + parentId + ' label').on('mouseover', this.options.mouseover);
                } else {
                    handleException('Incorrect "mouseover" parameter, must be function.');
                }

                if (typeof this.options.mouseout === 'function') {
                    $('#' + parentId + ' label').on('mouseout', this.options.mouseout);
                } else {
                    handleException('Incorrect "mouseout" parameter, must be function.');
                }

                if (typeof this.options.click === 'function') {
                    $('#' + parentId + ' label').on('click', this.options.click);
                } else {
                    handleException('Incorrect "click" parameter, must be function.');
                }

            return this;
        }      
    };

    var isHexadecimalNumber = function (number) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(number);
    }

    var lightHexadecimalColor = function (color, percent) {
        var factor = percent / 100;
        var r = parseInt(color.substring(1, 3), 16);
        var g = parseInt(color.substring(3, 5), 16);
        var b = parseInt(color.substring(5, 7), 16);
        r += Math.round((255 - r) * factor);
        r = r.toString(16);
        if (r.length == 1){
            r = '0' + r;
        }
        b += Math.round((255 - b) * factor);
        b = b.toString(16);
        if (b.length == 1){
            b = '0' + b;
        }
        g += Math.round((255 - g) * factor);
        g = g.toString(16);
        if (g.length == 1){
            g = '0' + g;
        }
        return "#" + r + g + b;
    }

    var createRatingElementsWithOptions = function (parentElement, options) {
        var parentId = parentElement.attr('id');
        var ratingElements = '';
        for (var i = options.number; i > 0; i--) {
            var inputId = parentId + 'rating-element' + i;
            var input = '<input type="radio" id="' + inputId + '" name="' + parentId + 'rating" value="' + i + '"/>';
            var label = '<label for="' + inputId + '" class="fa fa-' + options.icon + '" style="font-size: ' + options.size + '"></label>';
            ratingElements += (input + label);
        };
        parentElement.append(ratingElements);
        $("#" + parentId).css('color', options.normalColor);
        var inputSelector = "#" + parentId + "rating-element";
        var scoreElement = inputSelector + options.score;
        $(scoreElement).prop("checked", true);

        if (options.readonly) {
            for (var i = 1; i <= options.score; i++){
                $(inputSelector + i).next().css('color', options.ratedColor);
            }
        } else {
            var LightenPercent = 40;
            var setHighlightRatingOnHover = '<style>#' + parentId + ' input:checked ~ label, #' + // show rating element of rated color when clicked 
            parentId + ':not(:checked) label:hover, #' + parentId + // hover current rating element with rated color
            ':not(:checked) label:hover ~ label { color: ' + options.ratedColor+';  }' + // hover previous rating elements in list with rated color
            '#' + parentId + ' #' + parentId + ' input:checked + label:hover, #' + //hover current rating element with lighten color when changing rating
            parentId + ' input:checked ~ label:hover, #' + //hover current rating element with lighten rated color when changing rating
            parentId + ' label:hover ~ input:checked ~ label, #' + //lighten of current selection with lighten rated color
            parentId + ' input:checked ~ label:hover ~ label { color: ' + lightHexadecimalColor(options.ratedColor, LightenPercent) + ';}</style>' ;//lighten of current selection with lighten rated color
            $('head').append(setHighlightRatingOnHover);
        }
    };

    var handleException = function (exceptionString) {
        if (window.console && window.console.log) {
            window.console.log( exceptionString);
        } else {
            throw new UnavailableOutputMethodError('Window console unavailable.');
        }
    }

    $.fn.rating = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist!');
        }
    };

    $.fn.rating.defaults = {
        score: 4,
        size: '20px',
        number: 5,
        normalColor: '#ddd',
        ratedColor: '#ffd700',
        readonly: false,
        icon: "star",
        click: undefined,
        mouseout: undefined,
        mouseover: undefined   
    };


})(jQuery);