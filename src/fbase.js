import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBT_VDI5MgdOvFrl3wX0OAv9zgw91-_yZw",
  authDomain: "nwitter-3e0b7.firebaseapp.com",
  databaseURL: "https://nwitter-3e0b7.firebaseio.com",
  projectId: "nwitter-3e0b7",
  storageBucket: "nwitter-3e0b7.appspot.com",
  messagingSenderId: "162486109529",
  appId: "1:162486109529:web:acc0f5d13fdfb64f62b848"
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;

export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();