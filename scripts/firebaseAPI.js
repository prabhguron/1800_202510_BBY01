// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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

// DOM Elements
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const toggleAuth = document.getElementById("toggleAuth");

// Track current mode (signup or login)
let isLoginMode = false;

// Toggle between signup and login
toggleAuth.addEventListener("click", function(e) {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  
  if (isLoginMode) {
    // Switch to login mode
    authTitle.textContent = "Login";
    authBtn.textContent = "Login";
    toggleAuth.textContent = "Sign Up";
    document.querySelector(".switch-prompt").textContent = "Don't have an account? ";
    document.querySelector(".switch-prompt").appendChild(toggleAuth);
  } else {
    // Switch to signup mode
    authTitle.textContent = "Sign Up";
    authBtn.textContent = "Sign Up";
    toggleAuth.textContent = "Login";
    document.querySelector(".switch-prompt").textContent = "Already have an account? ";
    document.querySelector(".switch-prompt").appendChild(toggleAuth);
  }
});

// Form submission
authForm.addEventListener("submit", function(e) {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if (isLoginMode) {
    // Login functionality
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Logged in
        const user = userCredential.user;
        alert("Login successful!");
        window.location.href = "main.html";
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  } else {
    // Signup functionality
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        alert("Account created successfully!");
        window.location.href = "main.html";
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }
});