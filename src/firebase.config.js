// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLK_JnAQsyzV-_Xl7KTi51q-MrS_x1BVg",
  authDomain: "house-marketplace-app-e767c.firebaseapp.com",
  projectId: "house-marketplace-app-e767c",
  storageBucket: "house-marketplace-app-e767c.appspot.com",
  messagingSenderId: "572088868939",
  appId: "1:572088868939:web:f2c2e9eaa90991df8f6dce"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();