import React from 'react';

class Footer extends React.Component {
  onSelectDirectoryClick() {
    document.getElementById('options-select-file-directory').click();
  }

  render() {
    return (
      <div className="footer">
        <span onClick={this.onSelectDirectoryClick} style={{float: 'right', cursor: 'pointer'}}>
          <i className="fa fa-folder-open" aria-hidden="true"></i>
          {this.props.soundDir}
        </span>
        <input type="file" id="options-select-file-directory" webkitdirectory="true"  onChange={this.props.handleSoundDirChange} style={{ display: 'none' }}/>
      </div>
    );
  }
}

export default Footer;
