import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

async function logAllUsers() {
  try {
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
      // Log each user with their ID and data
      console.log( doc.data().username);
      lb.push({

          n : name,
          p : points,

      })

    });
  } catch (error) {
    console.error("Error getting users:", error);
  }

  lb.sort(({p:a}, {p:b}) => b-a);

  let str = "<table><tr><th>#</th><th>Name</th><th>Points</th></tr>";
  for (let i=0; i < length(lb); i++) {
      str += "<tr>";
      str += "<td>";
  }

}

// Call the function
logAllUsers();