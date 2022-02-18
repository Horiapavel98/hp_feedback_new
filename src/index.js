import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
});

const FeedbackForm = () => {

  const db = firebase.firestore();

  const [providerName, setProviderName] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleNameChange = (event) => {
    setProviderName(event.target.value)
  }

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value)
  }

  const handleSubmit = (event) => {

    let payload = {
      from: providerName === "" ? "<anonymous>" : providerName,
      feedback: feedback,
      timestamp: new Date()
    }

    db.collection("feedback")
      .add(payload)
      .then(alert("Feedback successfully sent! Thank you!"))

    setProviderName("");
    setFeedback("");

    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
        <label>Name (optional)</label>
          <input type="text"value={providerName} onChange={handleNameChange} />
        <label>Feedback</label>
            <textarea 
              rows={10}
              cols={300}
              value={feedback} onChange={handleFeedbackChange} />
            <br></br>
        <button type="submit">Send feedback</button>
      </form>
  );
};

function App() {
  return <FeedbackForm />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
