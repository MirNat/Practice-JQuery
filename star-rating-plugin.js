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

    var createRatingElementsWithOptions = function (parentElement, options) {
        var parentId = parentElement.attr('id');
        var ratingElements = '';
        for (var i = options.number; i > 0; i--) {
            var inputId = parentId + 'rating-element' + i;
            var input = '<input type="radio" id="' + inputId + '" name="' + parentId + 'rating" value="' + i + '"/>';
            var label = '<label for="' + inputId + '" class="fa fa-' + options.icon + '" style="font-size: ' + options.size + '"></label>';//color: green;
            ratingElements += (input + label);
        };
        parentElement.append(ratingElements);
        $("#" + parentId).css('color', options.normalColor);
        var scoreElement = "#" + parentId + " #" + parentId + "rating-element" + options.score;
        alert(scoreElement);
        $(scoreElement).prop("checked", true);
    };

               
        
        //addRule(document.styleSheets[0], "#rating" + id + " label:before", "content: " + options.contentIconValue);
        //var setRatingIconstring = '<style>#' + parentId + ' label:before { content: "'+'\\f004' + '";}</style>' ;
        //alert(options.contentIconValue + ' ' + setRatingIconstring);
        //$('head').append(setRatingIconstring);
 
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
        ratedColor: '#FFD700',//*
        readonly: false,//*
        icon: "star",
        click: undefined,
        mouseout: undefined,
        mouseover: undefined   
    };


})(jQuery);