import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './components/searchBar/searchBar';
import TrackList from './components/tracklist/tracklist';
import Playlist from './components/playlist/playlist';
import Header from './components/header/header';
import Spotify from './components/util/Spotify';

function App() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [playlistName, setPlaylistName] = useState(null)

  const searchTracks = (term) => {
    Spotify.search(term).then(results => { 
      setTracks(results);
    });
  };

  const addToPlaylist = (track) => {
    if (!playlist.some(t => t.id === track.id)) {
      setPlaylist([...playlist, track]);
    }
  };

  const removeFromPlaylist = (trackId) => {
    setPlaylist(playlist.filter(track => track.id !== trackId));
  };

  const savePlaylist = () => {
    if (playlist.length === 0 || !playlistName) {
      alert('Enter playlist name and add tracks to playlist');
      return;
    }
  
    const trackUris = playlist.map(track => track.uri);
    Spotify.savePlaylist(playlistName, trackUris).then(() => {
      setPlaylist([]);
      setPlaylistName('');
    });
  };

  const handleSetAccessToken = (token) => {
    setAccessToken(token);
  };

  return (
    <div className="App">
      <main className="App-body">
        <Header />
        <SearchBar setTracks={setTracks} searchTracks={searchTracks} setAccessToken={handleSetAccessToken} />
        <div className='box-result'>
          <TrackList tracks={tracks} addToPlaylist={addToPlaylist} />
          <Playlist playlist={playlist} playlistName={playlistName}  removeFromPlaylist={removeFromPlaylist} accessToken={accessToken} savePlaylist={savePlaylist} />
        </div>
        <img src={logo} className="App-logo" alt="logo" />
      </main>
    </div>
  );
};

export default App;