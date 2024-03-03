// Example firebaseConfig.js
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyD3RTdEGPT9rCygM-50f1B0aOf6V5F2ph0",
    authDomain: "jahez-ad0f9.firebaseapp.com",
    projectId: "jahez-ad0f9",
    storageBucket: "jahez-ad0f9.appspot.com",
    messagingSenderId: "840877912151",
    appId: "1:840877912151:web:ca77bd4709716aff20b312"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const functions = firebase.functions();
