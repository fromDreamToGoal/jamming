import './searchBar.css';
import { useEffect, useState } from 'react';

function SearchBar({ setTracks, setAccessToken }) {
    const [inputValue, setInputValue] = useState('');
    const [localAccessToken, setLocalAccessToken] = useState(null);

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('access_token');
        const tokenExpiration = localStorage.getItem('token_expiration');
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (tokenFromStorage && tokenExpiration && new Date().getTime() < tokenExpiration) {
            console.log('Access token from storage: ', tokenFromStorage);
            setAccessToken(tokenFromStorage);
            setLocalAccessToken(tokenFromStorage);
        } else if (code) {
            exchangeCodeForToken(code);
            window.location.hash = '';
        } else {
            console.log('Token not found or expired');
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_expiration');
        }
    }, [setAccessToken]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        if (!localAccessToken) {
            startAuthorization();
        } else {
            handleSearch();
        }
    };

    function generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      };

    const startAuthorization = () => {
        const clientId = '8b57f561cd76450194bfd65bf89333e6';
        const redirectUri = 'http://localhost:3000/?';
        const state = generateRandomString(16);
        const responseType = 'code';
        const authEndpoint = 'https://accounts.spotify.com/authorize';
        const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private';

        localStorage.setItem('spotify_auth_state', state);

        const authUrl = `${authEndpoint}?response_type=${responseType}&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;

        window.location = authUrl;
    }

    const exchangeCodeForToken = async (code) => {
        const clientId = '8b57f561cd76450194bfd65bf89333e6';
        const redirectUri = 'http://localhost:3000/?';
        const clientSecret = '210db2a97e044aa183a9ddfce0bdde4d';

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri,
                    client_id: clientId,
                    client_secret: '210db2a97e044aa183a9ddfce0bdde4d' // Replace with your actual client secret
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Response from token POST request:', data);
                const accessToken = data.access_token;
                const expiresIn = data.expires_in;
                const refreshToken = data.refresh_token;

                const expirationTime = new Date().getTime() + expiresIn * 1000;
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('token_expiration', expirationTime);
                localStorage.setItem('refresh_token', refreshToken);

                console.log('Access token stored in localStorage');
                console.log('Refresh token stored in local storage is:', refreshToken)

                setAccessToken(accessToken);
                setLocalAccessToken(accessToken);
            } else {
                console.error('Failed to fetch access token');
            }
        } catch (error) {
            console.error('Error fetching access token', error);
        }
    };

    const handleSearch = async () => {
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
