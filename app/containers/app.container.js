import React from 'react';
import Sound from 'react-sound';
import getMusicList from '../libs/getMusicList';
import SettingsStore from '../libs/SettingsStore';

import Details from '../components/details.component';
import Player from '../components/player.component';
import Progress from '../components/progress.component';
import Search from '../components/search.component';
import Footer from '../components/footer.component';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.settingsStore = new SettingsStore({
      configName: 'user-config',
      defaults: {
        windowBounds: { width: 800, height: 600 },
        soundDir: './public/sounds/'
      }
    });

    this.state = {
      currentTrack: {title: '', uri: '', album: '', artist: ''},
      playStatus: Sound.status.STOPPED,
      elapsed: '00:00',
      total: '00:00',
      position: 0,
      volume: 50,
      playFromPosition: 0,
      autoCompleteValue: '',
      remainingTracks: [],
      allTracks: [],
      soundDir: this.settingsStore.get('soundDir')
    };
  }

  componentDidMount() {
    this.populateAllTracksList()
      .then(() => {
        this.populateRemainingTracksList();
        const firstTrack = this.getRandomTrack();
        this.setState({
          currentTrack: {
            title: firstTrack.data.title,
            uri: this.state.soundDir + firstTrack.data.filename,
            album: firstTrack.data.album,
            artist: firstTrack.data.artist
          }
        });
        this.removeTrackFromQueue(firstTrack.index);
      })
      .catch(err => console.error(err));
  }

  componentDidUpdate() {
    if (!this.state.remainingTracks.length) {
      this.populateRemainingTracksList();
    }
  }

  populateAllTracksList() {
    return getMusicList(this.state.soundDir).then(tracks => {
      this.setState({ allTracks: tracks });
    });
  }

  populateRemainingTracksList() {
    this.setState({ remainingTracks: this.state.allTracks });
  }

  getRandomTrack() {
    const randomIndex = Math.floor(this.state.remainingTracks.length * Math.random());
    const randomTrack = this.state.remainingTracks[randomIndex];
    return {data: randomTrack, index: randomIndex};
  }

  removeTrackFromQueue(index) {
    const remainingTracks = [...this.state.remainingTracks];
    remainingTracks.splice(index, 1);
    this.setState({ remainingTracks });
  }

  setCurrentTrack(track) {
    this.setState({
      position: 0,
      elapsed: '00:00',
      currentTrack: {
        title: track.title,
        uri: this.state.soundDir + track.filename,
        album: track.album,
        artist: track.artist
      }
    });
  }

  handleSelect(value, item) {
    this.setState({autoCompleteValue: value, track: item});
  }

  handleChange(event, value) {
    this.setState({autoCompleteValue: event.target.value});
  }

  handleTrackPlaying(audio) {
    this.setState({
      elapsed: this.formatMilliseconds(audio.position),
      total: this.formatMilliseconds(audio.duration),
      position: audio.position / audio.duration
    });
  }

  handleTrackFinished() {
    const nextTrack = this.getRandomTrack();
    if (nextTrack) {
      this.setCurrentTrack(nextTrack.data);
      this.removeTrackFromQueue(nextTrack.index);
    }
  }

  handleSoundDirChange(event) {
    const newPath = event.target.files[0].path + '/';
    if (this.settingsStore.set('soundDir', newPath)) {
      this.setState({ soundDir: newPath }, () => {
        this.stop();
        this.populateAllTracksList()
          .then(() => {
            this.populateRemainingTracksList();
            const firstTrack = this.getRandomTrack();
            this.setState({
              currentTrack: {
                title: firstTrack.data.title,
                uri: this.state.soundDir + firstTrack.data.filename,
                album: firstTrack.data.album,
                artist: firstTrack.data.artist
              }
            });
            this.removeTrackFromQueue(firstTrack.index);
          })
          .catch(err => console.error(err));
      });
    }
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

    this.setState({ playStatus });
  }

  stop() {
    this.setState({
      playStatus: Sound.status.STOPPED,
      position: 0,
      elapsed: '00:00'
    });

    // Reset the remaining tracks queue and set a new currentTrack
    this.populateRemainingTracksList();
    const randomIndex = Math.floor(this.state.allTracks.length * Math.random());
    const randomTrack = this.state.allTracks[randomIndex];
    this.setCurrentTrack(randomTrack);
    this.removeTrackFromQueue(randomIndex);
  }

  forward() {
    this.handleTrackFinished();
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
        <Details
          title={this.state.currentTrack.title}
          artist={this.state.currentTrack.artist}
          album={this.state.currentTrack.album}
          playStatus={this.state.playStatus}
        />
        <Player
          togglePlay={this.togglePlay.bind(this)}
          stop={this.stop.bind(this)}
          playStatus={this.state.playStatus}
          forward={this.forward.bind(this)}
          backward={this.backward.bind(this)}
          defaultVolume={this.state.volume}
          volumeChange={this.volumeChange.bind(this)}
        />
        <Progress
          elapsed={this.state.elapsed}
          total={this.state.total}
          position={this.state.position}
        />
        <Sound
          url={this.state.currentTrack.uri}
          playStatus={this.state.playStatus}
          onPlaying={this.handleTrackPlaying.bind(this)}
          playFromPosition={this.state.playFromPosition}
          volume={this.state.volume}
          onFinishedPlaying={this.handleTrackFinished.bind(this)}
        />
        <Footer
          soundDir={this.state.soundDir}
          handleSoundDirChange={this.handleSoundDirChange.bind(this)}
        />
      </div>
    );
  }
}

export default AppContainer;
