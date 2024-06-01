import React from 'react';
import './tracklist.css';

const TrackList = ({ tracks }) => {
  return (
    <div className="track-list">
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
                <button className='button-add'>+</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrackList;