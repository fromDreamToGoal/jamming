# Jamming

Jamming is a web application that allows users to search for songs on Spotify, create custom playlists, and save these playlists to their Spotify account.

## Features

- **Search for Songs**: Use the search bar to find songs by title, artist, or album.
- **Add to Playlist**: Add individual tracks to a custom playlist.
- **Save to Spotify**: Save the playlist directly to your Spotify account with one click.

## Technologies Used

- **React**: For building the user interface.
- **Spotify API**: To fetch track details and handle playlist creation.
- **CSS**: For styling the application.

## Installation and Setup

To run this project locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/jamming.git
   cd jamming

2. **Install dependencies**:

    ```bash
    npm install

3. **Set up Spotify Developer credentials**:

    +	Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
	+	Create a new application.
	+	Copy the Client ID and set a Redirect URI for authorization.

4. **Create an** .env **file** in the root directory and add your credentials:

    ```env
    REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
    REACT_APP_REDIRECT_URI=your_redirect_uri

5. **Start the development server:**

    ```bash
    npm start

6. **Open** [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1. **Log in:** Click on “Search” to authorize the app.
2. **Search:** Type in a song title, artist, or album to search for songs.
3. **Create Playlist:** Add songs to the playlist and give it a name.
4. **Save Playlist:** Click “Save to Spotify” to save your playlist to your Spotify account.