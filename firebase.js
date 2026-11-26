
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";


// FIREBASE CONFIGURATION

const firebaseConfig = {
    apiKey: "AIzaSyDBLSVt-mCbyEsYpSO2WWtmDwXGFlCFF_E",
    authDomain: "igbolingo-2026.firebaseapp.com",
    projectId: "igbolingo-2026",
    storageBucket: "igbolingo-2026.firebasestorage.app",
    messagingSenderId: "505682422544",
    appId: "1:505682422544:web:5b57d41a13d67322cd1395",
    measurementId: "G-Z5FBJ356TT"
};


// INITIALIZE FIREBASE

const app = initializeApp(firebaseConfig);


// INITIALIZE AUTHENTICATION

export const auth = getAuth(app);


// INITIALIZE DATABASE

export const db = getFirestore(app);
