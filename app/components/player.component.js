import React from 'react';
import ClassNames from 'classnames';

class Player extends React.Component {
  render() {
    const playPauseClass = ClassNames({
      'fa fa-play': this.props.playStatus !== 'PLAYING',
      'fa fa-pause': this.props.playStatus === 'PLAYING'
    });
    return (
      <div>
        <div className="player">
          <div className="player__backward">
            <button onClick={this.props.backward}>
              <i className="fa fa-backward"></i>
            </button>
          </div>
          <div className="player__main">
            <button onClick={this.props.togglePlay}>
              <i className={playPauseClass}></i>
            </button>
            <button onClick={this.props.stop}>
              <i className="fa fa-stop"></i>
            </button>
          </div>
          <div className="player__forward">
            <button onClick={this.props.forward}>
              <i className="fa fa-forward"></i>
            </button>
          </div>
        </div>
        <div className="player">
          <div className="player__volume">
            <i className="fa fa-volume-down"></i>
            <input type="range" defaultValue={this.props.defaultVolume} onChange={this.props.volumeChange} min={0} max={100} />
            <i className="fa fa-volume-up"></i>
          </div>
        </div>
      </div>
    );
  }

}

export default Player;
