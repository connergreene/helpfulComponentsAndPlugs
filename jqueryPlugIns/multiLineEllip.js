(function ($) {

    $.fn.multiLineEllip = function (options) {
        //have to store the full text somewhere
        let originalText = "";
        let selectedElement = this[0];

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            lines: 3
        }, options);



        function getLines(element, lines) {
            var el = element;
            var cache = el.innerHTML;
            var text = el.innerHTML;

            //make sure it is only gets original text once
            if (!originalText) {
                originalText = el.innerHTML;
            }

            //temporary text to check line height
            el.innerHTML = 'a';
            var initial = el.offsetHeight * lines;
            el.innerHTML = cache;
            var arr = text.split(" ");

            //loop through words
            for (var i = 0; i < arr.length; i++) {
                //if the element is the wanted height (number of lines) stop looping
                if (el.offsetHeight == initial) {
                    var temp = el.innerHTML;
                    el.innerHTML = cache;

                    return temp;
                }
                //if there are already <= the specified lines
                else if (el.offsetHeight < initial) {
                    return el.innerHTML;
                }

                //cut word off end
                text = text.substring(0, text.lastIndexOf(" "));

                //put in button every time because it needs to be taken into account for the line count
                el.innerHTML = text + "...";
            }
        }




        let eleWidth = this.width();

        //responsive listener function
        function responsiveHandler() {
            //if the screen is shrinking
            if ($(selectedElement).width() < eleWidth) {
                //update width
                eleWidth = $(selectedElement).width();
                //adjust where truncation occurs
                $(selectedElement).html(getLines(selectedElement, settings.lines));
            }
            else if ($(selectedElement).width() > eleWidth) {
                //update width
                eleWidth = $(selectedElement).width();
                //set text back to full and then truncate
                $(selectedElement).html(originalText).html(getLines(selectedElement, settings.lines));
            }


        }

        //add resize listener for responsiveness
        $(window).resize(responsiveHandler);



        //initial truncation
        return this.html(getLines(selectedElement, settings.lines)).addClass("truncated");
    };

}(jQuery));