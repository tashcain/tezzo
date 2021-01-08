import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";

//Innitialize firebase

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAeJU1d4-zYfS3uOWNJiUM_83rD1mX184U",
    authDomain: "tezzo-c8c44.firebaseapp.com",
    databaseURL: "https://tezzo-c8c44.firebaseio.com",
    projectId: "tezzo-c8c44",
    storageBucket: "tezzo-c8c44.appspot.com",
    messagingSenderId: "1063941686229",
    appId: "1:1063941686229:web:976914b3cf33cb16d2f35c",
    measurementId: "G-ZV0B5X6SZ4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const database = firebase.database();

export { storage, database, firebase as default };