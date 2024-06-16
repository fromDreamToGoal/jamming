import './searchBar.css';
import { useEffect, useState } from 'react';
import pkceChallenge from 'pkce-challenge';

function SearchBar({ setTracks, setAccessToken }) {
    const [inputValue, setInputValue] = useState('');
    const [localAccessToken, setLocalAccessToken] = useState(null);

    useEffect(() => {
        const tokenFromURL = getAccessTokenFromURL();
        const tokenFromStorage = localStorage.getItem('access_token');
        const tokenExpiration = localStorage.getItem('token_expiration');

        if (tokenFromURL) {
            console.log('Access token from URL: ', tokenFromURL);
            setAccessToken(tokenFromURL);
            setLocalAccessToken(tokenFromURL);
        } else if (tokenFromStorage && tokenExpiration && new Date().getTime() < tokenExpiration) {
            console.log('Access token from storage: ', tokenFromStorage);
            setAccessToken(tokenFromStorage);
            setLocalAccessToken(tokenFromStorage);
        } else {
            console.log('Token not found or expired');
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_expiration');
        }

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (code && state) {
            handleCallback(code, state);
        }
    }, [setAccessToken]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const startAuthorization = () => {
        const challenge = pkceChallenge();
      
        const clientId = '8b57f561cd76450194bfd65bf89333e6';
        const redirectUri = 'http://localhost:3000/?';
        const state = Math.random().toString(36).substring(2, 15); // случайное состояние для защиты CSRF
        const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-public';
      
        localStorage.setItem('pkce_verifier', challenge.code_verifier);
        localStorage.setItem('auth_state', state);
      
        const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&code_challenge=${challenge.code_challenge}&code_challenge_method=S256`;
      
        window.location = authUrl;
    };

    const handleCallback = async (authCode, authState) => {
        const storedState = localStorage.getItem('auth_state');
        const verifier = localStorage.getItem('pkce_verifier');
      
        if (authState !== storedState) {
          console.error('State mismatch');
          return;
        }
      
        try {
          const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code: authCode,
              redirect_uri: 'http://localhost:3000/?',
              client_id: '8b57f561cd76450194bfd65bf89333e6',
              code_verifier: verifier
            })
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log('Access token:', data.access_token);
            localStorage.setItem('access_token', data.access_token);
            // Теперь вы можете использовать access_token для запросов к API Spotify
          } else {
            console.error('Failed to fetch access token');
          }
        } catch (error) {
          console.error('Error fetching access token', error);
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        console.log('Performing search with token:', localAccessToken);
        const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(inputValue)}&type=track`;
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${localAccessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Search results: ', data);
            setTracks(data.tracks.items);
        } else {
            console.error('Failed to fetch search results', response);
            if (response.status === 403) {
                console.warn('403 Forbidden: Access token might be expired or missing required scopes');
                localStorage.removeItem('access_token');
                localStorage.removeItem('token_expiration');
                setLocalAccessToken(null);
                setAccessToken(null);
                alert('Access token expired or missing permissions. Please reauthorize.');
                startAuthorization(); // Trigger reauthorization
            }
        }
    }

    function getAccessTokenFromURL() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (code && state) {
            return null;
        }

        const hash = window.location.hash;
        if (!hash) {
            return null;
        }

        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const expiresIn = hashParams.get('expires_in');

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
        <div className='form-with-result'>
            <div className='input-box'>
                <form className="search-bar" onSubmit={handleSearch}>
                 <input className='input-field'
                       id='search-field'
                       type="text"
                       value={inputValue}
                       onChange={handleInputChange}
                       placeholder='Track, artist, etc.'></input>
                 <button className='button' type='submit' id='authorize-button'>Search</button>
                </form>
                <button className='button' onClick={startAuthorization}>Authorize with Spotify</button>
            </div>
            <div className='search-result'>
            </div>
        </div>
        
    );
};

export default SearchBar;
