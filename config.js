admin = require("firebase-admin");
var serviceAccount = require('./ServicesAccountKyes.json');
const firebase = require("firebase");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCUEmWVx3LcRvUxR0ApdogK5XrryeE3OzI",
    authDomain: "codespromo-2a00a.firebaseapp.com",
    projectId: "codespromo-2a00a",
    storageBucket: "codespromo-2a00a.appspot.com",
    messagingSenderId: "203199809969",
    appId: "1:203199809969:web:618c8ab770f69a12afd590",
    measurementId: "G-BWZ0K9Z6MM"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const Code = db.collection("Codes");
module.exports = Code;
