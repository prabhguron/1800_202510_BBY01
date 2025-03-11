import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Function to get just the username
async function getUsernameOnly() {
  // Check if user is authenticated
  const user = auth.currentUser;
  
  if (!user) {
    console.log("User not authenticated");
    return null;
  }
  
  try {
    // Get the user document from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Return just the username
      return userDoc.data().username || null;
    } else {
      console.log("User document not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting username:", error);
    return null;
  }
}

// Example usage:
async function displayUsername() {
  const username = await getUsernameOnly();
  if (username) {
  
    // You could also update a DOM element here
    // document.getElementById('usernameDisplay').textContent = username;
  } else {
    console.log("Username not available");
  }
}

// Here is where you get the username and anything else CHANGE HERE TO MAKE IT LOOK NICER
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const username = await getUsernameOnly();
    document.getElementById("username").textContent = "welcome " + username;
  } else {
    console.log("Not logged in");
  }
});