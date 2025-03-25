import { auth, db } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userInfo = await getUserInfo();
  
      logAllUsers()
 
    }
  });

  async function getUserInfo() {
    // Check if user is authenticated
    const user = auth.currentUser;
  
    try {
      // Get the user document from Firestore
      const userDocRef = doc(db, "users", user.uid);
  
  
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Return user info
       return (userDoc.data()) 
      } else {
        console.log("User document not found");
        return null;
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }
  async function displayUsername() {
    const userInfo = await getUserInfo();
    console.log(userInfo);

    if (userInfo) {
      // You could also update a DOM element here
      // document.getElementById('usernameDisplay').textContent = username;
    } else {
      console.log("Username not available");
    }
  }


  async function logAllUsers() {
    try {
      const userInfo = await getUserInfo();
      const userName = userInfo.username;
      const userPoints = userInfo.points;

      const usersCollection = collection(db, "users");

document.getElementById("username").textContent += userName   
document.getElementById("points").textContent +=  ` ${userPoints} `
      //here you will add the each user make your own html then use
      //innerhtml to add it to leaderboard.html
    }
    catch(error){

    }


}


