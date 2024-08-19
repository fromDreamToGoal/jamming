import Spotify from '../util/Spotify';
import './searchBar.css';
import { useState, useEffect } from 'react';

function SearchBar({ setAccessToken, searchTracks }) {
    const [localToken, setLocalToken] = useState('');
    const [term, setTerm] = useState('');

    useEffect(() => {
        const token = Spotify.getAccessToken();
        if (token) {
            setLocalToken(token);
            setAccessToken(token);
        }
    }, [setAccessToken]);

    const handleTermChange = (event) => {
        setTerm(event.target.value);
    };

    const handleSearch = (event) => {
        event.preventDefault();

        if (!localToken) {
            alert('Please authorize to search for tracks');
            return;
        }

        searchTracks(term);
    };


    return (
        <div className='form-with-result'>
            <div className='input-box'>
                <form className="search-bar" onSubmit={handleSearch}>
                 <input className='input-field'
                       id='search-field'
                       type="text" 
                       onChange={handleTermChange}
                       placeholder='Track, artist, etc.'></input>
                 <button className='button' type='submit' id='authorize-button'>Search</button>
                </form>
            </div>
            <div className='search-result'>
            </div>
        </div>
        
    );
};

export default SearchBar;
