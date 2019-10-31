(function ($) {

    $.fn.moreLessByLine = function (options) {
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
                el.innerHTML = text + "<span id='readMoreCont'><span>... </span><a id='readMore' href=''><span>Read More</span>  <i class='fas fa-chevron-down'></i></a></span>";
            }
        }

        //this function is meant for if there are child elements
        function trimCloseTags(htmlString, startIndex) {
            //jump to point in elelemnt witht the last closing tag
            const currentIndex = startIndex || htmlString.lastIndexOf("</");
            //check if there is closing tag
            if (currentIndex > -1) {
                //recursively keep iterating until it gets to the innermost closing tag
                if (/\s/.test(htmlString[currentIndex - 1])) {
                    return trimCloseTags(htmlString, currentIndex - 1);
                } else if (htmlString[currentIndex - 1] === ">") {
                    return trimCloseTags(htmlString.substring(0, currentIndex - 1));
                } else {
                    //return string before that tag
                    return htmlString.substring(0, currentIndex);
                }
            } else {
                //return whole string if no close tags
                return htmlString.substring(0, htmlString.length);
            }
        }

        //click listener for read more
        this.on('click', '#readMore', function (e) {
            e.preventDefault();
            //add "show less" btn to the innermost text element of original text
            const text = trimCloseTags(originalText) + "<span id='showLessCont'> <a id='showLess' href=''><span>Show Less</span>  <i class='fas fa-chevron-up'></i></a></span>";

            //set html to formatted full text
            $(selectedElement).html(text).removeClass("truncated").addClass("full");
        });

        //click listener for show less
        this.on('click', '#showLess', function (e) {
            e.preventDefault();
            //remove show less button
            $(this).parent().remove();
            //trucate again
            $(selectedElement).html(getLines(selectedElement, settings.lines)).removeClass("full").addClass("truncated");

        });


        let eleWidth = this.width();

        //responsive listener function
        function responsiveHandler() {
            //only if truncated
            if ($(selectedElement).hasClass("truncated")) {
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

        }

        //add resize listener for responsiveness
        $(window).resize(responsiveHandler);



        //initial truncation
        return this.html(getLines(selectedElement, settings.lines)).addClass("truncated");
    };

}(jQuery));
