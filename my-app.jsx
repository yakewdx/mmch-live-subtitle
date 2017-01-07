const React = require('react');
const ReactDOM = require('react-dom');
const TagList = require('./sources/tag-list');
//require('./sources/toolbox');

const {CodeMirror} = require('./sources/live_editor');
var {BrowserWindow} = require('electron').remote;
//BrowserWindow.addDevToolsExtension('/Users/Extreme/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.14.11_0');


class SettingsButton extends React.Component {
  render() {
    var _sbClassName = 'settings_button';
    if (this.props.button_type !== undefined) {
      _sbClassName += ' ' + this.props.button_type;
    }
    return (
      <div className={_sbClassName}>{this.props.type}</div>
    );
  }
}

class SettingsBar extends React.Component {
  render() {
    return (
      <div className="settings_bar">
        <SettingsButton type='x' button_type='button_close'/>
      </div>
    );
  }
}

class Functional_area extends React.Component {
  render() {
    var content; 
    switch (this.props.content) {
      case 'TagList':
        content = <TagList />;
        break;
      default:
        content = null;
        break;
    }

    return (
      <div className="functional_area">
        <SettingsBar/>
        {content && content}
      </div>
    );
  }
}

class Folder extends React.Component {
  render() {
    return (
      <div className="folder">
      <Functional_area />
      </div>
    );
  }
}

class Live_editor extends React.Component {
  render () {
    return (
      <div className="live_editor">
        <CodeMirror />
      </div>
    );
  }
}

class Toolbox extends React.Component {
  render() {
    return (
      <div className="toolbox" id="toolbox">
        <Functional_area content='TagList'/>
      </div>
    );
  }
}

class RootLayer extends React.Component {
  render() {
    return(
      <div className="w-container main_container">
        <h1 className="header">MMCH Live! Subtitle</h1>
        <Folder />
        <Live_editor />
        <Toolbox /> 
      </div>
    );
  }
}




ReactDOM.render(
  //<h1 className="header">MMCH Live! Subtitle</h1>
  <RootLayer />,
  document.getElementById('main')
  //function(){}
);



// ReactDOM.render(
//   <a id="saveXmlTags">保存文件</a>,
//   document.getElementById('toolbox')
// );
