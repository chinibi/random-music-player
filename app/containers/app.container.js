import React from 'react';
import Sound from 'react-sound';
import getMusicList from '../libs/getMusicList';

import Details from '../components/details.component';
import Player from '../components/player.component';
import Progress from '../components/progress.component';
import Search from '../components/search.component';
import Footer from '../components/footer.component';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTrack: {title: ''},
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      volume: 50,
      playFromPosition: 0,
      autoCompleteValue: '',
      tracks: []
    };
  }

  componentDidMount() {
    this.populateTracksList();
  }

  populateTracksList() {
    const soundDir = './public/sounds/'; // relative to index.html
    let trackList = getMusicList(soundDir);
    console.log(trackList);
    this.setState({ tracks: trackList });
  }

  randomTrack() {
  }

  handleSelect(value, item) {
    this.setState({autoCompleteValue: value, track: item});
  }

  handleChange(event, value) {
    this.setState({autoCompleteValue: event.target.value});
  }

  handleSongPlaying(audio) {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: this.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration
    });
  }

  handleSongFinished() {
    // this.randomTrack();
    console.log('finished');
  }

  formatMilliseconds(milliseconds) {
    let _milliseconds = milliseconds;
    let hours = Math.floor(_milliseconds / 3600000);
    _milliseconds = _milliseconds % 3600000;

    let minutes = Math.floor(_milliseconds / 60000);
    _milliseconds = _milliseconds % 60000;

    let seconds = Math.floor(_milliseconds / 1000);
    milliseconds = Math.floor(_milliseconds % 1000);

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  togglePlay() {
    let playStatus = this.state.playStatus === Sound.status.PLAYING ? Sound.status.PAUSED : Sound.status.PLAYING;

    this.setState({playStatus});
  }

  stop() {
    this.setState({
      playStatus: Sound.status.STOPPED,
      position: 0,
      elapsed: '00:00'
    });
  }

  forward() {
    this.setState({playFromPosition: this.state.playFromPosition += 1000*10});
  }

  backward() {
    this.setState({playFromPosition: this.state.playFromPosition -= 1000*10});
  }

  volumeChange(e) {
    this.setState({ volume: parseInt(e.target.value) });
  }

  render() {
    const scotchStyle = {
      width: '100%',
      height: '100%',
      backgroundImage: `linear-gradient(
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0.7)
      )`
    };

    return (
      <div className="scotch_music" style={scotchStyle}>
        <Search
          autoCompleteValue={this.state.autoCompleteValue}
          tracks={this.state.tracks}
          handleSelect={this.handleSelect.bind(this)}
          handleChange={this.handleChange.bind(this)}
        />
        <Details
          title={this.state.currentTrack.title}
        />
        <Player
          togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          backward={this.backward.bind(this)}
          random={this.randomTrack.bind(this)}
          defaultVolume={this.state.volume}
          volumeChange={this.volumeChange.bind(this)}
        />
        <Progress
          elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position}
        />
        <Sound
          url={'public/sounds/Ys_I_&_II_-_First_Step_Towards_War.ogg'}
          playStatus={this.state.playStatus}
          onPlaying={this.handleSongPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          volume={this.state.volume}
          onFinishedPlaying={this.handleSongFinished.bind(this)}
        />
        <Footer />
      </div>
    );
  }
}

export default AppContainer;
