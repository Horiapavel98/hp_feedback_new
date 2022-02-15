import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
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

  const formik = useFormik({
    initialValues: { feedback: "" },
    onSubmit: (values) => {
      // Handle errors in connection
      db.collection("feedback").add(values);
      alert("Feedback submitted successfully!");
    },
  });
  return (
    // <LimitedTextarea limit={30} value="Hello!"/>
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="feedback">Write your feedback for Horia here ...</label>
      <br />
      <textarea
        id="feedback"
        name="feedback"
        type="text"
        rows={10}
        cols={300}
        onChange={formik.handleChange}
        value={formik.values.feedback}
      />
      <br />
      {/* <input
        id="feedback"
        name="feedback"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.feedback}
      /> */}
      <button type="submit">Send feedback</button>
    </form>
  );
};

function App() {
  return <FeedbackForm />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
