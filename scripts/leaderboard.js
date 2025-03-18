import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

async function logAllUsers() {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    
    console.log("All users in collection:");
    querySnapshot.forEach((doc) => {
      // Log each user with their ID and data
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error getting users:", error);
  }
}

// Call the function
logAllUsers();