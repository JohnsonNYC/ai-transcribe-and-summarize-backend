const express = require("express");
const { createClient } = require("@deepgram/sdk");
require("dotenv").config();

const app = express();
const port = 8080;
const DG_ACCESS_TOKEN = process.env.API_KEY;

const fs = require("fs");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ffmpeg = require("ffmpeg-static");

app.get("/", (req, res) => {
  res.send("HERE!");
});

const defualtUrl = "https://dpgr.am/spacewalk.wav";
const testUrl = "https://www.youtube.com/watch?v=ir-mWUYH_uo";

app.post("/transcribe-audio", async (req, res) => {
  try {
    // STEP 1: Create a Deepgram client using the API key
    const deepgram = createClient(DG_ACCESS_TOKEN);

    // STEP 2: Call the transcribeUrl method with the audio payload and options
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      {
        url: defualtUrl,
      },
      {
        model: "nova-2",
        smart_format: true,
      }
    );

    if (result) {
      res.send(result);
    } else {
      res.send(error);
    }
  } catch (error) {
    console.log({ error });
  }
});

app.post("/transcribe-video", async (req, res) => {
  const deepgram = createClient(DG_ACCESS_TOKEN);

  const YD = new YoutubeMp3Downloader({
    ffmpegPath: ffmpeg,
    outputPath: "./",
    youtubeVideoQuality: "highestaudio",
  });

  YD.download("ir-mWUYH_uo");

  YD.on("progress", (data) => {
    console.log(data.progress.percentage + "% downloaded");
  });

  YD.on("finished", async (err, video) => {
    const videoFileName = video.file;
    console.log(`Downloaded ${videoFileName}`);

    const file = {
      buffer: fs.readFileSync(videoFileName),
      mimetype: "audio/mp3",
    };

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.createReadStream(videoFileName),
      { model: "nova" }
    );

    res.send(result);
    console.log({ result, error });
  });
});

app.listen(port, () => {
  console.log(`App Listening On Port:${port}`);
});
