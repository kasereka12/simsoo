// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBGuhQFeYRqnk_F3Ok7xqvYX7tstDOeQ3Y",
    authDomain: "kimsooliving-755e8.firebaseapp.com",
    projectId: "kimsooliving-755e8",
    storageBucket: "kimsooliving-755e8.firebasestorage.app",
    messagingSenderId: "131878517083",
    appId: "1:131878517083:web:d7ee1650503d31b974827e",
    measurementId: "G-LRH7D13GD4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


export { app, db };