// Import the functions you need from the SDKs you need
import firebase from "firebase/compat";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJtT7kN3qONeoOHyiof5WyovQ-kYwLJG0",
    authDomain: "foosball-bot-1b613.firebaseapp.com",
    databaseURL: "https://foosball-bot-1b613-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "foosball-bot-1b613",
    storageBucket: "foosball-bot-1b613.appspot.com",
    messagingSenderId: "1090454975305",
    appId: "1:1090454975305:web:a5249f5fa0eb9111fa2098"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.database();

export default firebase;


