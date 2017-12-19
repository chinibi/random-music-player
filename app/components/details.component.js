import React from 'react';
import Sound from 'react-sound';

class Details extends React.Component {
  renderMetaData(props) {
    let metadata = '';
    if (props.artist && props.album) {
      metadata = `${props.artist} - ${props.album}`;
    }
    else if (props.artist) {
      metadata = props.artist;
    }
    else if (props.album) {
      metadata = props.album;
    }

    return  <h5>{props.playStatus !== Sound.status.STOPPED ? metadata : '\u00a0'}</h5>;
  }

  render() {
    return (
      <div className="details">
        <h3>{this.props.playStatus !== Sound.status.STOPPED ? this.props.title : '\u00a0'}</h3>
        {this.renderMetaData(this.props)}
      </div>
    );
  }
}

export default Details;
