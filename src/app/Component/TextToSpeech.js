"use client";
// components/TextToSpeech.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);
  
  const voice = "en-US-Wavenet-C"; // Default to US English (Female)

  const handleSpeak = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=YOUR_API_KEY`,
        {
          input: { text },
          voice: { languageCode: "en-US", name: voice },
          audioConfig: { audioEncoding: "MP3" },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const audioContent = response.data.audioContent;
      const audioBlob = new Blob([
        new Uint8Array(atob(audioContent).split("").map((c) => c.charCodeAt(0))),
      ], { type: "audio/mp3" });

      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioSrc(audioUrl);
    } catch (error) {
      console.error("Error during TTS request:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAudio = async () => {
      if (audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play();
      }
    };
    getAudio();
  }, [audioSrc]);

  return (
    <div className="container">
      <h1 className="title">Text to Speech</h1>
      <textarea
        className="text-area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here"
      />
      <button className="speak-button" onClick={handleSpeak} disabled={loading}>
        {loading ? "Loading..." : "Speak"}
      </button>
      {audioSrc && (
        <audio controls src={audioSrc} className="audio-player" />
      )}
    </div>
  );
};

export default TextToSpeech;
