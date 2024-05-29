import './searchBar.css';
import { useEffect, useState } from 'react';



function SearchBar () {
    const [inputValue, setInputValue] = useState('');
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        localStorage.removeItem('access_token');

        const tokenFromURL = getAccessTokenFromURL();
        const tokenFromStorage = localStorage.getItem('access_token');
        if (tokenFromURL) {
            console.log('Access token from URK: ', tokenFromURL);
            setAccessToken(tokenFromURL);
        } else if (tokenFromStorage) {
            console.log('Access token from srorage: ', tokenFromStorage);
            setAccessToken(tokenFromStorage);
        } else {
            console.log('Token not found');
        }
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        if (!accessToken) {
            getToken();
        } else {
            handleSearch();
        }
    };

    const getToken = () => {
        const clientId = '8b57f561cd76450194bfd65bf89333e6';
        const redirectUri = 'http://localhost:3000/?';
        const responseType = 'token';
        const authEndpoint = 'https://accounts.spotify.com/authorize';

        const authUrl = `${authEndpoint}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}`;
        console.log(authUrl);

        window.location = authUrl;
        
    }

    const handleSearch = async () => {
        const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(inputValue)}&type=track`;
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Search results: ', data);
        } else {
            console.error('Failed to fetch search results');
        }
    }

    function getAccessTokenFromURL() {
        const hash = window.location.hash;
        if (!hash) {
            return null;
        }

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');

        if(accessToken) {
            window.location.hash = '';

            sessionStorage.setItem('access_token', accessToken);
            setTimeout( () => sessionStorage.removeItem('access_token'), expiresIn * 1000);

            return accessToken;
        }
        return null;
    };

    return (
        <form className="main-box" onSubmit={handleButtonClick}>
            <input className='input-field'
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}></input>
            <button className='button' type='submit' id='authorize-button'>Search</button>
       </form>
    );
};

export default SearchBar;