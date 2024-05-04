// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6BplVfDdgVA6ahGRJIlec03Q9xgNhdcY",
  authDomain: "blogify-4191d.firebaseapp.com",
  projectId: "blogify-4191d",
  storageBucket: "blogify-4191d.appspot.com",
  messagingSenderId: "48509753309",
  appId: "1:48509753309:web:e1d2c422453542e69b0834",
  measurementId: "G-4HMK0DR9BX"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);