import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './components/searchBar/searchBar';
import TrackList from './components/tracklist/tracklist';
import Playlist from './components/playlist/playlist';
import Header from './components/header/header';

function App() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const addToPlaylist = (track) => {
    if (!playlist.some(t => t.id === track.id)) {
      setPlaylist([...playlist, track]);
    }
  };

  const removeFromPlaylist = (trackId) => {
    setPlaylist(playlist.filter(track => track.id !== trackId));
  };

  return (
    <div className="App">
      <main className="App-body">
        <Header />
        <SearchBar setTracks={setTracks} setAccessToken={setAccessToken} />
        <TrackList tracks={tracks} addToPlaylist={addToPlaylist} />
        <Playlist playlist={playlist} removeFromPlaylist={removeFromPlaylist} accessToken={accessToken} />
        <img src={logo} className="App-logo" alt="logo" />
      </main>
    </div>
  );
}

export default App;
