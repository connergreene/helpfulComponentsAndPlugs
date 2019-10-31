import React from 'react';

export default class ReadMore extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            truncated: true,
            contWidth: 0
        }
    }

    getLines = (element, lines) => {
        var el = element;
        var cache = el.innerHTML;
        var text = el.innerHTML;

        el.innerHTML = 'a';
        var initial = el.offsetHeight * lines;
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

            el.innerHTML = text + "<span id='readMoreCont'><span>... </span><a id='readMore' href=''><span>Read More</span>  <i class='fas fa-chevron-down'></i></a></span>";
        }
    }

    toggleLines = (e) => {
        e.preventDefault();
        this.setState({ truncated: !this.state.truncated });
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
                return htmlString.substring(0, currentIndex);
            }
        }
        else {
            return htmlString.substring(0, htmlString.length);
        }

        

    } 

    updateDimensions = () => {
        if (this.state.contWidth !== this.readMoreRef.clientWidth) {
            this.setState({ contWidth: this.readMoreRef.clientWidth})
        }
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.truncated !== this.state.truncated) {
            let readMoreEl = $(this.readMoreRef);

            if (this.state.truncated) {
                readMoreEl.html(this.getLines(this.readMoreRef, this.props.lines));

                if (document.getElementById("readMore")) {
                    document.getElementById("readMore").onclick = this.toggleLines;
                }

            }
            else {
                
                const text = this.trimCloseTags(this.props.content) + "<span id='showLessCont'> <a id='showLess' href=''><span>Show Less</span>  <i class='fas fa-chevron-up'></i></a></span>";
                readMoreEl.html(text);

                if (document.getElementById("showLess")) {
                    document.getElementById("showLess").onclick = this.toggleLines;
                }
                
            }
            
        }

        if (prevState.contWidth !== this.state.contWidth) {
            let readMoreEl = $(this.readMoreRef);

            if (this.readMoreRef.innerHTML !== this.props.content) {
                readMoreEl.html(this.props.content);
            }

            readMoreEl.html(this.getLines(this.readMoreRef, this.props.lines));
            if (document.getElementById("readMore")) {
                document.getElementById("readMore").onclick = this.toggleLines;
            }
        }

        
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.setState({ contWidth: this.readMoreRef.clientWidth });

    }


    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }


    render() {
        const { content } = this.props;
        return (
            <div className={this.state.truncated ? "readMore truncated" : "readMore full"} ref={(node) => { this.readMoreRef = node; }} ></div>
        );
    }
}