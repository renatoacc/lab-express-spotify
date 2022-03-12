require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + "/views/partials");
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) => {
  const result = await spotifyApi.searchArtists(req.query.search);
  const items = result?.body?.artists?.items ?? [];
  res.render("results", { items });
});

app.get("/albums/:artistId", async (req, res) => {
  const resultId = await spotifyApi.getArtistAlbums(req.params.artistId);
  const album = resultId?.body?.items ?? [];
  res.render("albums", { album });
});

app.get("/tracks/:albumId", async (req, res) => {
  const resultId = await spotifyApi.getAlbumTracks(req.params.albumId);
  const tracks = resultId?.body?.items ?? [];
  res.render("tracks", { tracks });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
