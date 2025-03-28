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

// Image assignment based on points 
//Use the last example to how to reference images
const pointImages = [
  { min: 0, max: 9, image: "/images/level1.png" },
  { min: 10, max: 19, image: "/images/level2.png" },
  { min: 20, max: 29, image: "/images/level3.jpg" },
  { min: 30, max: Infinity, image: "/images/level2.png" },//Use this
];

// Function to determine the correct image
function getImageForPoints(points) {
  for (const tier of pointImages) {
    if (points >= tier.min && points <= tier.max) {
      return tier.image;
    }
  }
  return "default.jpg"; // Fallback image
}

// Function to get the user info from the database
async function getUserInfo() {
  // Check if user is authenticated
  const user = auth.currentUser;

  if (!user) {
    console.log("User not authenticated");
    return;
  }

  try {
    // Get the user document from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User Data:", userData);

      // Check for points and display image
      if (userData.points !== undefined) {
        const userImage = getImageForPoints(userData.points);
        document.getElementById("user-image").src = userImage; // Update image element
      }
    } else {
      console.log("User document not found");
    }
  } catch (error) {
    console.error("Error getting user info:", error);
  }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    getUserInfo();
  } else {
    console.log("No user logged in");
  }
});

// pull users points
// array that stores images
// array that stores points
