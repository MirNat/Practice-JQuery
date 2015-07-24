(function($) {
  'use strict';
    var methods = {
        init: function(params) {
            return this.each(function() {
                this.self = $(this);
                this.options = $.extend(true, {}, $.fn.rating.defaults, params);
                this.options.number = Math.max(this.options.number, 1);
                this.options.score = Math.max(this.options.score, 0);

                createRatingElementsWithOptions(this.self, this.options);

                if (typeof this.options.mouseover === 'function') {
                    this.self.on('mouseover.rating', this.options.mouseover);
                }

                if (typeof this.options.mouseout === 'function') {
                    this.self.on('mouseout.rating', this.options.mouseout);
                }

                if (typeof this.options.click === 'function') {
                    this.self.on('click.rating', this.options.click);
                }
            });
        }      
    };


    var lightHexColor = function lighten (color, percent) {
        var factor = percent/100;
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
        var lightedInputSelector = "#" + parentId + "rating-element";
        var scoreElement = lightedInputSelector + options.score;
        $(scoreElement).prop("checked", true);

        if (options.readonly) {
            for (var i = 1; i <= options.score; i++){
                $(lightedInputSelector + i).next().css('color', options.ratedColor);
            }
        } else {
            var setHighlightRatingOnHover = '<style>#' + parentId + ' input:checked ~ label, #' + parentId + ':not(:checked) label:hover, #' + parentId + ':not(:checked) label:hover ~ label { color: ' + options.ratedColor+';  }' +
                '#' + parentId + ' #' + parentId + ' input:checked + label:hover, #' + parentId + ' input:checked ~ label:hover, #' + parentId + ' label:hover ~ input:checked ~ label, #' + parentId + ' input:checked ~ label:hover ~ label { color: ' + lightHexColor(options.ratedColor, 40) + ';}</style>' ;
            $('head').append(setHighlightRatingOnHover);
        }
    };

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