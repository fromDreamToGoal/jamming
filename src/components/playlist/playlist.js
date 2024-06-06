import React, { useState } from 'react';
import './playlist.css';

const Playlist = ({ playlist, removeFromPlaylist, accessToken }) => {
  const [playlistName, setPlaylistName] = useState('');

  const handleSavePlaylist = async () => {
    if (!playlistName) {
      alert('Please name your playlist');
      return;
    }

    const userId = await getUserId();
    if (!userId) {
      alert('Failed to get user ID');
      return;
    }

    const playlistId = await createPlaylist(userId);
    if (!playlistId) {
      alert('Failed to create playlist');
      return;
    }

    const trackUris = playlist.map(track => track.uri);
    const success = await addTracksToPlaylist(playlistId, trackUris);
    if (success) {
      alert('Playlist saved to Spotify!');
    } else {
      alert('Failed to save playlist');
    }
  };

  const getUserId = async () => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.id;
    } else {
      console.log(`Used token: ${accessToken}`);
      console.error('Failed to fetch user ID');
      return null;
    }
  };

  const createPlaylist = async (userId) => {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: playlistName,
        description: 'New playlist created by Jamming',
        public: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.id;
    } else {
      console.error('Failed to create playlist');
      return null;
    }
  };

  const addTracksToPlaylist = async (playlistId, trackUris) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: trackUris
      })
    });

    if (response.ok) {
      return true;
    } else {
      console.error('Failed to add tracks to playlist');
      return false;
    }
  };

  return (
    <div className="playlist">
      <h2>Playlist</h2>
      <input placeholder='Name your new playlist'
             className='input-field'
             value={playlistName}
             onChange={e => setPlaylistName(e.target.value)}/>
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
      <button className='save-button' onClick={handleSavePlaylist}>Save to Spotify</button>
    </div>
  );
};

export default Playlist;
