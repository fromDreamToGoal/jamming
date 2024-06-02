import React from 'react';
import './playlist.css';

const Playlist = ({ playlist }) => {
  return (
    <div className="playlist">
      <h2>Playlist</h2>
      {playlist.length === 0 ? (
        <p>No tracks in playlist</p>
      ) : (
        <ul>
          {playlist.map(track => (
            <li key={track.id} className="playlist-item">
              <p>{track.name} by {track.artists.map(artist => artist.name).join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Playlist;
