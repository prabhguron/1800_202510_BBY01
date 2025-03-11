import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Function to get the user info from the database
async function getUserInfo() {
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
      // Return user info
      return userDoc.data() || null;
    } else {
      console.log("User document not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
}

// Example usage:
async function displayUsername() {
  const userInfo = await getUserInfo();
  if (userInfo) {
  
    // You could also update a DOM element here
    // document.getElementById('usernameDisplay').textContent = username;
  } else {
    console.log("Username not available");
  }
}

// Here is where you get the username and anything else CHANGE HERE TO MAKE IT LOOK NICER
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userInfo = await getUserInfo();
    document.getElementById("username").textContent = "welcome " + userInfo.username;
    document.getElementById("points").textContent = "points: " + userInfo.points;
  } else {
    console.log("Not logged in");
  }
});


// Gets user doc and adds 1 point to points var
async function addPoints() {
  const userInfo = await getUserInfo();
  if (userInfo) {
  
    const user = auth.currentUser;
    const docRef = doc(db, "users", user.uid);
    userInfo.points ++;
    setDoc(docRef, userInfo);
    showPoints(user.uid)

  }
}
 function showPoints(user) {

  const docRef = doc(db, "users", `${user}`); // Replace with currentId right now it's using test1 id gmail

  const unsubscribe = onSnapshot(docRef, (doc) => {
  
    if (doc.exists()) {
      console.log("Current data: ", doc.data().points);
      
      document.getElementById("points").textContent = "points: " +doc.data().points;
  
  
  
    } else {
      console.log("No such document!");
    }
  });
  
}




// Add a point to the current users points
document.getElementById('button').addEventListener('click', function(e) {
    addPoints();
});