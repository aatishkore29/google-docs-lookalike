// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh4aNM6qlqIHmz63GZzI6DlcSk0jCTyU0",
  authDomain: "docs-d829e.firebaseapp.com",
  projectId: "docs-d829e",
  storageBucket: "docs-d829e.firebasestorage.app",
  messagingSenderId: "30366808473",
  appId: "1:30366808473:web:20adb964a0dd3096c5bb08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
