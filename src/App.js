import logo from './logo.svg';
import './App.css';
import SearchBar from './components/searchBar/searchBar';
import Header from './components/header/header';

function App() {
  return (
    <div className="App">
      <main className="App-body">
        <Header />
        <SearchBar />
        <img src={logo} className="App-logo" alt="logo" />
      </main>
    </div>
  );
}

export default App;
