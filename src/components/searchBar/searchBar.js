import Spotify from '../util/Spotify';
import './searchBar.css';
import { useEffect, useState } from 'react';

function SearchBar({ setTracks, setAccessToken }) {
    const [inputValue, setInputValue] = useState('');
    const [localToken, setLocalToken] = useState('');


    useEffect(() => {
        if (!localToken) {
            let token = Spotify.getAccessToken();
            setLocalToken(token);
        }
    },[localToken]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        try {
            if (!localToken) {
                let token = Spotify.getAccessToken();
                setLocalToken(token);
            } else {
                Spotify.search(inputValue);
            };
        } catch (error) {
            console.log(error);
        };
    };


    return (
        <div className='form-with-result'>
            <div className='input-box'>
                <form className="search-bar" onSubmit={handleButtonClick}>
                 <input className='input-field'
                       id='search-field'
                       type="text"
                       value={inputValue}
                       onChange={handleInputChange}
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
