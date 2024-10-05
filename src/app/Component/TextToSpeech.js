"use client"
import React, { useState } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const handleSpeak = () => {
    if (!text.trim()) {
      setError("Please enter some text to speak.");
      return;
    }

    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "en-US";

    speech.onend = () => {
      console.log("Speech has finished.");
    };

    speech.onerror = (e) => {
      console.error("Error during speech synthesis:", e);
      setError("Speech synthesis failed.");
    };

    window.speechSynthesis.speak(speech);
    setError(null); // Reset error state
  };

  return (
    <div className="container">
      <h1 className="title">Text to Speech</h1>
      <textarea
        className="text-area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here"
      />
      <button className="speak-button" onClick={handleSpeak}>
        Speak
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TextToSpeech;
