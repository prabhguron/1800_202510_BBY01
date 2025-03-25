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

// Function to get the user info from the database
async function getUserInfo() {
  // Check if user is authenticated
  const user = auth.currentUser;
  console.log(auth);

  console.log(user)

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
async function displayUsername() {
  const userInfo = await getUserInfo();
  if (userInfo) {
    // You could also update a DOM element here
    // document.getElementById('usernameDisplay').textContent = username;
  } else {
    console.log("Username not available");
  }
}
console.log('working')
async function logAllUsers() {
  try {
    const userInfo = await getUserInfo();
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    let lb = [];
    
    console.log("All users in collection:");
    //here you will add the each user make your own html then use
    //innerhtml to add it to leaderboard.html
    querySnapshot.forEach((doc) => {
      let user = doc.data();
      let name = user.username;
      let points = user.points;
      let id = "";

      if (name == userInfo.username) {
          id = "highlight";
      }

      lb.push({

          n : name,
          p : points,
          ID : id,

      })

    });

    lb.sort(({p:a}, {p:b}) => b-a);
    console.log(lb[0]);

    if (document.getElementById("sortlist").value == "bottom") {
        lb.reverse();
    }

    let str = "<table><tr><th>#</th><th>Name</th><th>Points</th></tr>";
    for (let i=0; i < lb.length; i++) {
        str += "<tr" + " id=" + lb[i].ID + ">";
        str += "<td>" + (i+1) + "</td>";
        str += "<td>" + lb[i].n + "</td>";
        str += "<td>" + lb[i].p + "</td>";
        str += "</tr>";
    }
    str += "</table>";
    document.getElementById("list").innerHTML = str;

  } catch (error) {
    console.error("Error getting users:", error);
  }

}

// Call the function


  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userInfo = await getUserInfo();
  
      logAllUsers()
 
    }
  });
  

//Check if sort order is changed
var e = document.getElementById("sortlist");
e.addEventListener("change", function() {
    logAllUsers();
});