import React from 'react';

//install 'resize-observer-polyfill'
import ResizeObserver from 'resize-observer-polyfill';
import './readMore.scss';

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
        var hiddenText = "";

        el.innerHTML = 'a';
        var initial = el.offsetHeight * lines;
        el.innerHTML = cache;
        var arr = text.split(" ");
        for (var i = 0; i < arr.length; i++) {
            if (el.offsetHeight == initial) {
                var temp = el.innerHTML;
                el.innerHTML = cache;
                return temp + "<span class='hiddenText' style='display: none;' aria-hidden='true'>" + this.trimCloseTags(hiddenText) + "</span>";
            }
            else if (el.offsetHeight < initial) {
                return el.innerHTML + "<span class='hiddenText' style='display: none;' aria-hidden='true'>" + this.trimCloseTags(hiddenText) + "</span>";
            }

            hiddenText = text.substring(text.lastIndexOf(" "), text.length) + hiddenText;
            text = text.substring(0, text.lastIndexOf(" "));
            el.innerHTML = text + "<span class='readAloudIgnore' id='readMoreCont'><span>... </span><a id='readMore' href=''><span>Read More</span>  <i class='fas fa-chevron-down'></i></a></span>";
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

    componentDidUpdate(prevProps, prevState) {
        let readMoreEl = $(this.readMoreRef);

        if (prevState.truncated !== this.state.truncated) {

            if (this.state.truncated) {
                readMoreEl.html(this.getLines(this.readMoreRef, this.props.lines));

                if (document.getElementById("readMore")) {
                    document.getElementById("readMore").onclick = this.toggleLines;
                }

            }
            else {
                const text = this.trimCloseTags(this.props.content) + "<span class='readAloudIgnore' id='showLessCont'> <a id='showLess' href=''><span>Show Less</span>  <i class='fas fa-chevron-up'></i></a></span>";
                readMoreEl.html(text);

                if (document.getElementById("showLess")) {
                    document.getElementById("showLess").onclick = this.toggleLines;
                }

            }

        }

        if (this.state.truncated && ((prevState.contWidth !== this.state.contWidth) || (prevState.contHeight !== this.state.contHeight))) {
            if (this.readMoreRef.innerHTML !== this.props.content) {
                readMoreEl.html(this.props.content);
            }

            readMoreEl.html(this.getLines(this.readMoreRef, this.props.lines));
            if (document.getElementById("readMore")) {
                document.getElementById("readMore").onclick = this.toggleLines;
            }
        }


    }

    observeResize = () => {
        if (this.readMoreRef.clientWidth !== this.state.contWidth) {
            this.setState({ contWidth: this.readMoreRef.clientWidth });
        }

        if (this.readMoreRef.offsetHeight !== this.state.offsetHeight) {
            this.setState({ contHeight: this.readMoreRef.offsetHeight });
        }
    }

    componentDidMount() {
        this.resizeObserver = new ResizeObserver(this.observeResize);
        this.resizeObserver.observe(this.readMoreRef);

        if (this.props.setToExpanded) {
            this.setState({ truncated: false });
        }
    }


    componentWillUnmount() {
        this.resizeObserver.unobserve(this.readMoreRef);
    }


    render() {
        const { content } = this.props;
        return (
            <div className={this.state.truncated ? "readMore truncated" : "readMore full"} ref={(node) => { this.readMoreRef = node; }} dangerouslySetInnerHTML={{ __html: content }} ></div>
        );
    }
}