import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";
//import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFTXklLIv3MgqDkPFbbeJG-NoPYcq4UU8",
  authDomain: "pruebaexamen-15090.firebaseapp.com",
  projectId: "pruebaexamen-15090",
  storageBucket: "pruebaexamen-15090.appspot.com",
  messagingSenderId: "803322459056",
  appId: "1:803322459056:web:9f9ae8959a5e897099dc75"
};
initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);