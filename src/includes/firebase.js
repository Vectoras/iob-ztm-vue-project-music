import firebase from "firebase/app";
import "firebase/auth"; // firebase is smart enough to extend the core without the need to use another object
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEjRzkM0dGgugD9Ij39_dE3ZaXR32oaTA",
  authDomain: "music-ztm-vue.firebaseapp.com",
  projectId: "music-ztm-vue",
  storageBucket: "music-ztm-vue.appspot.com",
  messagingSenderId: "485203393330",
  appId: "1:485203393330:web:d0025ffd28fb9c3e5f352b",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const usersCollection = db.collection("users");
const auth = firebase.auth();

export { auth, db, usersCollection };
