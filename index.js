const express = require("express");
const axios = require("axios");
const { createClient } = require("@deepgram/sdk");

const app = express();
const port = 8080;
const API_KEY = "tester";

app.get("/", (req, res) => {
  res.send("HERE!");
});

app.post("/transcribe", async (req, res) => {
  try {
    // STEP 1: Create a Deepgram client using the API key
    const deepgram = createClient(API_KEY);

    // STEP 2: Call the transcribeUrl method with the audio payload and options
    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
      {
        url: "https://dpgr.am/spacewalk.wav",
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

app.listen(port, () => {
  console.log(`App Listening On Port:${port}`);
});
