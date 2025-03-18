import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

async function logAllUsers() {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    
    console.log("All users in collection:");
    //here you will add the each user make your own html then use
    //innerhtml to add it to leaderboard.html
    querySnapshot.forEach((doc) => {
      // Log each user with their ID and data
      console.log( doc.data().username);

    });
  } catch (error) {
    console.error("Error getting users:", error);
  }
}

// Call the function
logAllUsers();