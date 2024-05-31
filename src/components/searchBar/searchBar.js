import './searchBar.css';
import { useEffect, useState } from 'react';

function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const tokenFromURL = getAccessTokenFromURL();
        const tokenFromStorage = localStorage.getItem('access_token');
        const tokenExpiration = localStorage.getItem('token_expiration');

        if (tokenFromURL) {
            console.log('Access token from URL: ', tokenFromURL);
            setAccessToken(tokenFromURL);
        } else if (tokenFromStorage && tokenExpiration && new Date().getTime() < tokenExpiration) {
            console.log('Access token from storage: ', tokenFromStorage);
            setAccessToken(tokenFromStorage);
        } else {
            console.log('Token not found or expired');
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_expiration');
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
        const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-public';

        const authUrl = `${authEndpoint}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;
        console.log(authUrl);

        window.location = authUrl;
    }

    const handleSearch = async () => {
        console.log('Performing search with token:', accessToken);
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
            console.error('Failed to fetch search results', response);
            if (response.status === 403) {
                console.warn('403 Forbidden: Access token might be expired or missing required scopes');
                localStorage.removeItem('access_token');
                localStorage.removeItem('token_expiration');
                setAccessToken(null);
                alert('Access token expired or missing permissions. Please reauthorize.');
                getToken(); // Trigger reauthorization
            }
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

        if (accessToken) {
            window.location.hash = '';

            const expirationTime = new Date().getTime() + expiresIn * 1000;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('token_expiration', expirationTime);

            console.log('Access token stored in localStorage');

            return accessToken;
        }
        return null;
    }

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
