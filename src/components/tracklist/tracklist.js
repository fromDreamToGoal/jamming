import React, { useState } from 'react';
import './tracklist.css';
import Playlist from '/Users/sergei_golovenko/Projects/jamming/src/components/playlist/playlist.js';

const TrackList = ({ tracks }) => {
    const [playlist, setPlaylist] = useState([]);

    const addToPlaylist = (track) => {
      // Проверка, есть ли уже трек в плейлисте
      if (!playlist.find(item => item.id === track.id)) {
         setPlaylist([...playlist, track]);
      } else {
         alert('Track is already in the playlist');
      }
    };

    const removeFromPlaylist = (trackId) => {
      setPlaylist(playlist.filter(track => track.id !== trackId));
    };

  return (
    <div className='box-result'>
      <div className="track-list">
        <h2>Results of search</h2>
      {tracks.length === 0 ? (
        <p>No tracks found</p>
      ) : (
        <ul className='table'>
          {tracks.map(track => (
            <li key={track.id} className="track-item">
                <img src={track.album.images[0]?.url} alt={track.album.name} width="50" height="50" />
                <div className="track-details">
                  <p>{track.name}</p>
                  <p>{track.artists.map(artist => artist.name).join(', ')}</p>
                  {/* <p>{track.album.name}</p> */}
                </div>
                <button className='button-add' onClick={() => addToPlaylist(track)}>+</button>
            </li>
          ))}
        </ul>
       )}
       </div>
       <Playlist playlist={playlist} removeFromPlaylist={removeFromPlaylist} />
    </div>
    
  );
};

export default TrackList;