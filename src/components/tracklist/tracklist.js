import React from 'react';
import './tracklist.css';

const TrackList = ({ tracks = [], addToPlaylist }) => {
  // Проверяем, является ли tracks массивом и не пуст ли он
  const hasTracks = Array.isArray(tracks) && tracks.length > 0;

  return (
    <div className="track-list">
      <h2>Results of search</h2>
      {!hasTracks ? (
        <p>No tracks found</p>
      ) : (
        <ul className='table'>
          {tracks.map(track => (
            <li key={track.id} className="track-item">
              {track.album?.images?.length > 0 && (
                <img
                  src={track.album.images[0].url}
                  alt={track.album.name}
                  width="50"
                  height="50"
                />
              )}
              <div className="track-details">
                <p>{track.name}</p>
                <p>{track.artist}</p>
              </div>
              <button className='button-add' onClick={() => addToPlaylist(track)}>+</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrackList;
