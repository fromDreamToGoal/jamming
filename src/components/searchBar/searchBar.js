import './searchBar.css';
import { useEffect } from 'react';



function SearchBar () {

    useEffect(() => {
        document.getElementById('authorize-button').addEventListener('click', getToken);
        return () => {
            document.getElementById('authorize-button').removeEventListener('click', getToken);
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
        document.getElementById('authorize-button').addEventListener('click', () => {
            window.location = authUrl;
        });
    };

    return (
        <form className="main-box" >
            <input className='input-field' type="text" ></input>
            <button className='button' type='submit' id='authorize-button'>Search</button>
       </form>
    );
};

export default SearchBar;