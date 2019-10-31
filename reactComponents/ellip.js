import React from 'react';

export default class Ellip extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            contWidth: 0
        }
    }

    getLines = (element, lines) => {
        var el = element;
        var cache = el.innerHTML;
        var text = el.innerHTML;
        var initial;

        if (el.childNodes[0].nodeType == 1) {
            //el.innerHTML = el.childNodes[0].innerHTML = 'a';
            el.childNodes[0].innerHTML = 'a'
            initial = el.childNodes[0].offsetHeight * lines;
        }
        else {
            el.innerHTML = 'a';
            initial = el.offsetHeight * lines;
        }

        el.innerHTML = cache;
        var arr = text.split(" ");

        for (var i = 0; i < arr.length; i++) {
            if (el.offsetHeight == initial) {
                var temp = el.innerHTML;
                el.innerHTML = cache;

                return temp;
            }
            else if (el.offsetHeight < initial) {
                return el.innerHTML;
            }

            text = text.substring(0, text.lastIndexOf(" "));

            el.innerHTML = text + "...";
        }
    }

    trimCloseTags = (htmlString, startIndex) => {

        const currentIndex = startIndex || htmlString.lastIndexOf("</");
        if (currentIndex > -1) {
            if (/\s/.test(htmlString[currentIndex - 1])) {
                return this.trimCloseTags(htmlString, currentIndex - 1);
            }
            else if (htmlString[currentIndex - 1] === ">") {
                return this.trimCloseTags(htmlString.substring(0, currentIndex - 1));
            }
            else {
                return htmlString.substring(0, currentIndex);;
            }
        }
        else {
            return htmlString.substring(0, htmlString.length);
        }

        

    } 

    updateDimensions = () => {
        if (this.state.contWidth !== this.ellipRef.clientWidth) {
            this.setState({ contWidth: this.ellipRef.clientWidth})
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.contWidth !== this.state.contWidth) {
            let ellipEl = $(this.ellipRef);

            if (this.ellipRef.innerHTML !== this.props.content) {
                ellipEl.html(this.props.content);
                //console.log("this.props.conten", this.props.content)
            }

            ellipEl.html(this.getLines(this.ellipRef, this.props.lines));
        }

        
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.setState({ contWidth: this.ellipRef.clientWidth});
    }


    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }


    render() {
        const { content } = this.props;
        return (
            <div className="ellip truncated" ref={(node) => { this.ellipRef = node; }}></div>
        );
    }
}