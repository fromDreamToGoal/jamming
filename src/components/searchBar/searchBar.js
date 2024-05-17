import './searchBar.css';

function SearchBar () {
    return (
        <form className="main-box">
            <input className='input-field' type="text"></input>
            <button className='button'>Search</button>
       </form>
    );
};

export default SearchBar;