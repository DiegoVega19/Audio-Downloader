const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const http = require("http").createServer(app);
const port = process.env.PORT || 5000;

const getAudio = (videoURL, res) => {
  const videoStream = ytdl(videoURL, {
    quality: "highestaudio",
    filter: "audioonly",
  });

  ytdl.getInfo(videoURL).then((info) => {
    console.log("title:", info.videoDetails.title);
    console.log("rating:", info.player_response.videoDetails.averageRating);
    console.log("uploaded by:", info.videoDetails.author.name);

    res.setHeader("Content-Type", "audio/mpeg");
   res.setHeader("Content-Disposition", `attachment; filename="${info.videoDetails.title}.mp3"`);
  });

  // Set response headers for MP3 file
  
  // Pipe the video stream directly to the response
  videoStream.pipe(res);
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/", (req, res) => {
  getAudio(req.body.url, res);
});

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
