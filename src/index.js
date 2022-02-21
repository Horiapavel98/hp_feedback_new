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

  const [providerKey, setProviderKey] = useState("");
  const [providerName, setProviderName] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleProviderKeyChange = (event) => {
    setProviderKey(event.target.value)
  }

  const handleNameChange = (event) => {
    setProviderName(event.target.value)
  }

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value)
  }

  const validateAndRemoveKeyEntry = async (key) => {
    let keys_arr = []

    await db.collection("keys").get().then(
      (querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          keys_arr.push({id: doc.id, key: doc.data().key})
        })
      }
    )

    let res = keys_arr.filter(e => e.key === key);

    if (res.length === 1) {
      db.collection("keys").where('key', '==', key).get().then(element => element.forEach(doc => doc.ref.delete()))
      return true;
    } else {
      return false;
    }
  }

  const handleSubmit = async (event) => {

    event.preventDefault();

    let res = await validateAndRemoveKeyEntry(providerKey);
    
    if (res) {

      db.collection("feedback").add({
        from: providerName === "" ? "<anonymous>" : providerName,
        feedback: feedback,
        timestamp: new Date()  
      })
      .then((docRef) => {
        alert("Feedback successfully sent! Thank you!")
      })
      .catch((error) => {
        console.error("Error adding document", error)
      })
    } else {
      alert("Key invalidated or non-existing!");
    }

    setProviderKey("");
    setProviderName("");
    setFeedback("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Key</label>
          <input type="text" value={providerKey} onChange={handleProviderKeyChange} />
        <label>Name (optional)</label>
          <input type="text" value={providerName} onChange={handleNameChange} />
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
