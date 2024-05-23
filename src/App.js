import logo from './logo.svg';
import './App.css';
import SearchBar from './components/searchBar/searchBar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <SearchBar />
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
