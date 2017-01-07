var React = require('react');
var Codemirror = require('react-codemirror');

var CodeMirror = React.createClass({
    getInitialState: function () {
        return {
            code: "// Code"
        };
    },
    updateCode: function (newCode) {
        this.setState({
            code: newCode
        });
    },
    componentDidMount: function () {
        "use strict";
        let CodeMirror = this.refs['CodeMirror'].getCodeMirrorInstance();
        let showHint = require('./show-hint');
        showHint(CodeMirror);
        var WORD = /([\u4e00-\u9fa5]|[a-zA-Z])+/, RANGE = 500;

        CodeMirror.registerHelper("hint", "tag", function (editor, options) {
            var word = options && options.word || WORD;
            var range = options && options.range || RANGE;
            var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
            var end = cur.ch, start = end;
            while (start && word.test(curLine.charAt(start - 1)))--start;
            var curWord = start != end && curLine.slice(start, end);

            var list = options && options.list || [], seen = {};
            var re = new RegExp(word.source, "g");
            for (var dir = -1; dir <= 1; dir += 2) {
                var line = cur.line, endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
                for (; line != endLine; line += dir) {
                    var text = editor.getLine(line), m;
                    while (m = re.exec(text)) {
                        if (line == cur.line && m[0] === curWord) continue;
                        if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen, m[0])) {
                            seen[m[0]] = true;
                            list.push(m[0]);
                        }
                    }
                }
            }
            return { list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end) };
        });
    },
    handleKeyUpEvent: function (e) {
        let cm = this.refs['CodeMirror'].getCodeMirror();
        this.autocomplete(cm);
    },
    autocomplete: function (cm) {
        let codeMirror = this.refs['CodeMirror'].getCodeMirrorInstance();
        codeMirror.showHint(cm, codeMirror.hint.tag);
    },
    render: function () {
        var options = {
            lineNumbers: true,
            lineWrapping: true,
            completeSingle: false,
            completeOnSingleClick: false,
            extraKeys: {
                'Tab': this.autocomplete
            }
        };
        return <Codemirror ref="CodeMirror" value={this.state.code} onKeyUp={this.handleKeyUpEvent} onChange={this.updateCode} options={options} />
    }
});

module.exports.CodeMirror = CodeMirror;
