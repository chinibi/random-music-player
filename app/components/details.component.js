import React from 'react';

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

    return <h5>{metadata}</h5>;
  }

  render() {
    return (
      <div className="details">
        <h3>{this.props.title}</h3>
        {this.renderMetaData(this.props)}
      </div>
    );
  }
}

export default Details;
