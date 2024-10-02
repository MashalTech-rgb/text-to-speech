"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const voice = "en-US-Standard-C"; // Ensure this voice is available in your API
  const apiKey = "YOUR_API_KEY"; // Replace with your actual API key

  const handleSpeak = async () => {
    setLoading(true);
    setError(null); // Reset error state before making a request
    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, // Use the correct endpoint
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
      setError(error.response ? error.response.data.error.message : error.message); // Capture detailed error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAudio = async () => {
      if (audioSrc) {
        const audio = new Audio(audioSrc);
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setError("Audio playback failed.");
        });
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {audioSrc && (
        <audio controls src={audioSrc} className="audio-player" />
      )}
    </div>
  );
};

export default TextToSpeech;

