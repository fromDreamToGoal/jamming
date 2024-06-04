import React from 'react';
import './playlist.css';

const Playlist = ({ playlist, removeFromPlaylist }) => {
  return (
    <div className="playlist">
      <h2>Playlist</h2>
      <input placeholder='Your name playlist'
             className='input-field'></input>
      {playlist.length === 0 ? (
        <p>No tracks in playlist</p>
      ) : (
        <ul>
          {playlist.map(track => (
            <li key={track.id} className="playlist-item">
              <p>{track.name} by {track.artists.map(artist => artist.name).join(', ')}</p>
              <button onClick={() => removeFromPlaylist(track.id)}>-</button>
            </li>
          ))}
        </ul>
      )}
      <button className='save-button'>Save to Spotify</button>
    </div>
  );
};

export default Playlist;
