import React from 'react';
import './playlist.css';

const Playlist = ({ playlist = [], playlistName, setPlaylistName, removeFromPlaylist, savePlaylist }) => {

  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  return (
    <div className="playlist">
      <h2>Your new playlist</h2>
      <input className='input-field'
        type="text"
        placeholder="Enter playlist name"
        value={playlistName}
        onChange={handleNameChange}
      />
      <ul className="playlist-tracks">
        {playlist.length === 0 ? (
          <p>No tracks in playlist</p>
        ) : (
          playlist.map(track => (
            <li key={track.id} className="track-item">
              <div className="track-details">
                <p>{track.name}</p>
                <p>{track.artist}</p>
              </div>
              <button className='button-remove' onClick={() => removeFromPlaylist(track.id)}>-</button>
            </li>
          ))
        )}
      </ul>
      <button className='save-button' onClick={savePlaylist}>Save playlist</button>
    </div>
  );
};

export default Playlist;
