import './searchBar.css';
import { useEffect } from 'react';



function SearchBar () {

    useEffect(() => {
        const token = getAccessTokenFromURL();
        if(token) {
            console.log('Access token: ', token);
        } else {
            console.log('Token not found');
        };
    }, []);

    const getToken = (event) => {
        event.preventDefault();
        const clientId = '8b57f561cd76450194bfd65bf89333e6';
        const redirectUri = 'http://localhost:3000/?';
        const responseType = 'token';
        const authEndpoint = 'https://accounts.spotify.com/authorize';

        const authUrl = `${authEndpoint}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}`;
        console.log(authUrl);

        window.location = authUrl;
        
    };

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

            localStorage.setItem('access_token', accessToken);
            setTimeout( () => localStorage.removeItem('access_token'), expiresIn * 1000);

            return accessToken;
        }
    };

    return (
        <form className="main-box" onSubmit={getToken}>
            <input className='input-field' type="text" ></input>
            <button className='button' type='submit' id='authorize-button'>Search</button>
       </form>
    );
};

export default SearchBar;