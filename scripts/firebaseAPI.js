// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

function showMessage(message) {
  let messageElement = document.getElementById('authMessage');
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.id = 'authMessage';
    messageElement.style.padding = '10px';
    messageElement.style.marginTop = '10px';
    messageElement.style.borderRadius = '4px';
    messageElement.style.textAlign = 'center';
    messageElement.style.transition = 'opacity 0.5s ease';
    const form = document.getElementById('authForm');
    form.after(messageElement);
  }
  
  messageElement.style.display = 'block';
  messageElement.style.backgroundColor = '#f8d7da';
  messageElement.style.color = '#721c24';
  messageElement.innerHTML = message;
  messageElement.style.opacity = 1;
  
  
  setTimeout(function() {
    messageElement.style.opacity = 0;
  }, 5000);
}

// Handle form submission
function handleAuth(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const isSignUp = document.getElementById('authTitle').textContent === 'Sign Up';
  
  if (isSignUp) {
    // Check if username field exists and has value
    const usernameField = document.getElementById('username');
    if (!usernameField || !usernameField.value) {
      showMessage('Username is required');
      return;
    }
    
    const username = usernameField.value;
    
    // Create account
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Account created successfully
        const user = userCredential.user;
        
        // Create user profile in Firestore
        const userData = {
          email: email,
          username: username,
          createdAt: new Date().toISOString(),
          points : 0
        };
        
        // Save to Firestore
        const docRef = doc(db, "users", user.uid);
        return setDoc(docRef, userData);
      })
      .then(() => {
        showMessage('Account Created Successfully');
        
        // Store user ID
        localStorage.setItem('loggedInUserId', auth.currentUser.uid);
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = 'main.html';
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          showMessage('Email Address Already Exists!');
        } else if (errorCode === 'auth/weak-password') {
          showMessage('Password is too weak. Please use at least 6 characters.');
        } else {
          showMessage('Error: ' + error.message);
        }
      });
  } else {
    // Sign in
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        showMessage('Login successful!');
        
        // Store user ID
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = 'main.html';
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
          showMessage('Incorrect Email or Password');
        } else if (errorCode === 'auth/user-not-found') {
          showMessage('Account does not exist');
        } else {
          showMessage('Error: ' + error.message);
        }
      });
  }
}

// Toggle between signup and login forms
function toggleAuthMode() {
  const authTitle = document.getElementById('authTitle');
  const authBtn = document.getElementById('authBtn');
  const toggleText = document.querySelector('.switch-prompt');
  const toggleLink = document.getElementById('toggleAuth');
  
  const isCurrentlySignUp = authTitle.textContent === 'Sign Up';
  
  // Toggle form title and button text
  authTitle.textContent = isCurrentlySignUp ? 'Login' : 'Sign Up';
  authBtn.textContent = isCurrentlySignUp ? 'Login' : 'Sign Up';
  
  // Toggle the prompt text and link
  toggleText.innerHTML = isCurrentlySignUp ? 
    'Don\'t have an account? <a href="#" id="toggleAuth">Sign Up</a>' : 
    'Already have an account? <a href="#" id="toggleAuth">Login</a>';
  
  // Re-attach event listener to the new toggleAuth link
  document.getElementById('toggleAuth').addEventListener('click', function(e) {
    e.preventDefault();
    toggleAuthMode();
  });
  
  // Handle username field
  let usernameField = document.getElementById('username');
  
  if (!isCurrentlySignUp) {
    // Switching to Sign Up - add username field if it doesn't exist
    if (!usernameField) {
      const inputGroup = document.createElement('div');
      inputGroup.className = 'input-group';
      
      usernameField = document.createElement('input');
      usernameField.type = 'text';
      usernameField.id = 'username';
      usernameField.placeholder = 'Username';
      usernameField.required = true;
      
      inputGroup.appendChild(usernameField);
      
      // Insert after email field
      const emailGroup = document.getElementById('email').parentNode;
      emailGroup.after(inputGroup);
    }
  } else {
    // Switching to Login - remove username field if it exists
    if (usernameField) {
      usernameField.parentNode.remove();
    }
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set up form submission handler
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', handleAuth);
  }
  
  // Set up toggle between signup and login
  const toggleAuth = document.getElementById('toggleAuth');
  if (toggleAuth) {
    toggleAuth.addEventListener('click', function(e) {
      e.preventDefault();
      toggleAuthMode();
    });
  }
  
  // Make sure we start in signup mode with username field
  toggleAuthMode(); // This will switch to login
  toggleAuthMode(); // This will switch back to signup
});