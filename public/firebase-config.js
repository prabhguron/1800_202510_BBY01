// Import the Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2HTAGOLx5_L3VAzvV3JFrGyMSKbK9fDc",
  authDomain: "tossriteloginsignup.firebaseapp.com",
  projectId: "tossriteloginsignup",
  storageBucket: "tossriteloginsignup.firebasestorage.app",
  messagingSenderId: "278925744719",
  appId: "1:278925744719:web:2ad367945846692b7aa83a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export the Firebase services
export { app, auth, db };